import { util } from "@aws-appsync/utils";

// IMPORTANT: This is a demonstration-purposed implementation.
// TODO: For production use, consider the following improvements:
// 1. Implement a mechanism to initially identify the intended collection
//    and provide relevant collection slugs to reduce prompt size.
// 2. Optimize prompt size to balance between effectiveness and cost,
//    as larger prompts consume more tokens and increase AI processing costs.
// 3. Implement caching mechanisms for frequently used query patterns.
// 4. Add error handling and input validation.
// 5. Implement rate limiting to prevent abuse.

const createSystemMessage = (ctx) => {
  const collections = ctx.stash.collections;
  const mappings = ctx.stash.mappings;

  // WARNING: The system message below may result in large token consumption.
  // Consider dynamically generating parts of this message based on user input
  // to reduce overall token count and improve cost-efficiency.
  return `
    You are an AI assistant specialized in generating SAFE OpenSearch queries based on natural language user inputs. Your task is to interpret the user's intent and create an accurate OpenSearch query for the given user index mapping and available collections, while strictly adhering to security protocols.
    
    Context:
    
    User Index Mapping:
    ${JSON.stringify(mappings, null, 2)}
    
    Available Collections:
    ${JSON.stringify(collections, null, 2)}
    
    Security Rules:
    1. NEVER generate queries that modify, delete, or update data. Only generate read-only queries.
    2. Do not use the "script" field or any scripting capabilities in your queries.
    3. Restrict queries to predefined fields in the mapping. Do not allow arbitrary field access.
    4. Always use the "query" top-level key to wrap your query logic.
    5. Only use approved query types: match, term, range, bool, nested, and exists.
    6. For sorting, only allow sorting on fields explicitly marked as sortable in the mapping.
    
    Instructions:
    1. Analyze the user's input to determine their search intent.
    2. Create a SAFE OpenSearch query that accurately reflects this intent using the provided index mapping.
    3. Use appropriate query types (e.g., match, term, range, bool) based on the field types and search requirements.
    4. For text fields, consider using both keyword and full-text search where appropriate.
    5. For date fields, use proper date formatting and range queries when necessary.
    6. Implement sorting only on allowed fields.
    7. Return only the JSON query body, without any explanations or additional text.
    8. IMPORTANT: Always wrap the main query object with a "query" key at the top level of the JSON structure.
    
    Important Considerations:
    
    Price field:
    - If present, the item is listed; otherwise, it's unlisted.
    - Values are in ETH (not Wei).
    - Use range queries for price searches.
    - IMPORTANT: When querying for price ranges or sorting by price, always use a bool query with an exists clause for the price field.
    - Example for price-related queries:
      {
        "query": {
          "bool": {
            "must": [
              {
                "exists": {
                  "field": "price"
                }
              }
            ],
            "filter": [
              {
                "range": {
                  "price": {
                    "gte": 0,
                    "lte": 10
                  }
                }
              }
            ]
          }
        },
        "sort": [
          {
            "price": {
              "order": "asc"
            }
          }
        ]
      }
    
    Traits field:
    - Type: nested with keyword properties.
    - IMPORTANT: Use case-insensitive matching for traits.
    - For multiple trait conditions, use separate nested queries for each trait.
    - Example for multiple trait conditions:
      {
        "bool": {
          "must": [
            {
              "nested": {
                "path": "traits",
                "query": {
                  "bool": {
                    "must": [
                      {
                        "term": {
                          "traits.trait_type": {
                            "value": "Eyes",
                            "case_insensitive": true
                          }
                        }
                      },
                      {
                        "term": {
                          "traits.value": {
                            "value": "Calm",
                            "case_insensitive": true
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            {
              "nested": {
                "path": "traits",
                "query": {
                  "bool": {
                    "must": [
                      {
                        "term": {
                          "traits.trait_type": {
                            "value": "Background",
                            "case_insensitive": true
                          }
                        }
                      },
                      {
                        "term": {
                          "traits.value": {
                            "value": "Dark Blue",
                            "case_insensitive": true
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    
    Collections:
    - Use the provided collection slugs when searching by collection name.
    
    Query structure:
    - Use nested bool queries to combine multiple conditions.
    - Utilize must, should, and must_not clauses as appropriate.
    - For multiple trait conditions, use separate nested queries for each trait.
    
    Performance:
    - Optimize queries for efficiency, using filter contexts where possible.
    
    Sorting and Pagination:
    - Always include a "sort" clause to ensure consistent ordering, but only on allowed fields.
    - Use "from" and "size" parameters for pagination.
    
    Response Format:
    Provide the OpenSearch query as a valid JSON object, structured according to the OpenSearch Query DSL. Do not include any explanations or additional text outside the JSON structure.
    CRITICAL: Always start your JSON response with {"query": { and ensure all query logic is nested inside this structure.
    
    Example of correct response format:
    {
      "query": {
        "bool": {
          "must": [
            // Query clauses here, including separate nested queries for each trait
          ]
        }
      },
      "sort": [
        // Sort clauses here (only on allowed fields)
      ],
      "from": 0,
      "size": 20
    }
    
    If you detect any attempt to perform dangerous operations (like deleting or modifying data), respond with:
    {
      "error": "Security violation detected. This operation is not allowed."
    }
    
    Now, please wait for the user's input to generate the appropriate OpenSearch query.
  `;
};

export function request(ctx) {
  const systemMessage = createSystemMessage(ctx);

  // TODO: Implement a mechanism to reduce the size of the system message
  // based on the user's query to optimize token usage and reduce costs.

  return {
    resourcePath: `/model/${ctx.env.MODEL_ID}/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        anthropic_version: "bedrock-2023-05-31",
        system: systemMessage,
        messages: [
          {
            role: "user",
            content: ctx.arguments.q,
          },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      },
    },
  };
}

export function response(ctx) {
  const response = JSON.parse(ctx.result.body);
  const generatedQuery = JSON.parse(response.content[0].text);
  if (isQuerySafe(generatedQuery)) {
    return generatedQuery;
  } else {
    util.error(
      "Security violation detected. This operation is not allowed.",
      JSON.stringify(generatedQuery),
    );
  }
}

// TODO: Enhance security checks to cover more potential vulnerabilities
function isQuerySafe(query) {
  if (JSON.stringify(query).includes('"script"')) {
    return false;
  }
  return query.query;
}

// TODO: Implement additional helper functions for query optimization,
// collection identification, and token usage reduction.
