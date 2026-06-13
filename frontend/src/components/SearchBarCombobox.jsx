import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircularProgress } from "@mui/material";

export default function SearchBarCombobox({
  value,
  onChange,
  options = [],
  label = "",
  placeholder = "Select...",
  className = "",
  disabled = false,
}) {
  const [query, setQuery] = useState("");
  const [isClickedOpen, setIsClickedOpen] = useState(false);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const handleSelect = (val, close) => {
    onChange(val);
    setQuery("");
    close(); // closes popover via render prop
  };

  return (
    <Popover
      className={`w-full flex items-center gap-6 bg-gray-50 rounded-full ${className}`}
    >
      {({ open, close }) => (
        <div
          className={`relative w-full p-2 px-6 md:py-2 py-4 transition-all rounded-full ${open ? "bg-white shadow-lg" : "hover:bg-white hover:shadow-lg"
            }`}
        >
          {label && (
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
          )}

          <div>
            {disabled ? (
              <div className="opacity-50 cursor-not-allowed w-full rounded-md p-0 flex justify-between items-center">
                <span className={selectedLabel ? "" : "text-gray-400"}>
                  {selectedLabel || placeholder}
                </span>
              </div>
            ) : (
              <PopoverButton
                as="div"
                className="cursor-pointer"
                onClick={() => setIsClickedOpen(true)}
              >
                <div className="w-full rounded-md p-0 flex justify-between items-center">
                  <span className={selectedLabel ? "" : "text-gray-400"}>
                    {selectedLabel || placeholder}
                  </span>
                </div>
              </PopoverButton>
            )}
          </div>

          <AnimatePresence>
            {open && (
              <PopoverPanel
                static
                as={motion.div}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 z-30 mt-1 origin-top bg-white rounded-2xl shadow-2xl p-0 border border-gray-100"
              >
                <div className="max-h-60 overflow-y-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="p-3 text-gray-500 flex justify-center items-center">
                      <CircularProgress />
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value, close)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {option.label}
                      </button>
                    ))
                  )}
                </div>
              </PopoverPanel>
            )}
          </AnimatePresence>
        </div>
      )}
    </Popover>
  );
}
