// MuiModal.js
import React, { useRef } from "react";
import { Modal, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";

const MuiModal = ({
  open,
  onClose,
  title,
  children,
  headerBackground,
  height = "90vh",
  width = "90vw",
  color,
}) => {
  const modalRef = useRef(null);

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose}>
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ duration: 0.1 }}
            ref={modalRef}
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            <div className="bg-white shadow-xl rounded-lg outline-none w-full max-w-2xl max-h-[100vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-2 rounded-t-md border-b border-borderGray">
                <div className="text-title w-full text-center text-black">
                  {title}
                </div>
                <IconButton sx={{ p: 0 }} onClick={onClose}>
                  <IoMdClose
                    className="text-white"
                    style={{ color: headerBackground ? "white" : "black" }}
                  />
                </IconButton>
              </div>

              {/* Content */}
              <div className="py-4 px-8">{children}</div>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default MuiModal;
