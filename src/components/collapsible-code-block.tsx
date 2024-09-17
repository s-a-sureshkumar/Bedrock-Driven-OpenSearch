import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/16/solid";

const CollapsibleCodeBlock = ({
  code,
  language = "javascript",
}: {
  code: string;
  language?: string;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (!code) {
    return null;
  }

  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden mt-2">
      <button
        onClick={toggleCollapse}
        className="w-full flex justify-between items-center p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
      >
        {isCollapsed ? (
          <ChevronDownIcon className="h-6" />
        ) : (
          <ChevronUpIcon className="h-6" />
        )}
      </button>
      {!isCollapsed && (
        <pre className="text-sm font-mono text-zinc-600 dark:text-white bg-zinc-200 dark:bg-zinc-700 p-4 overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      )}
    </div>
  );
};

export default CollapsibleCodeBlock;
