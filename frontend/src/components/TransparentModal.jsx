import React, { useRef } from "react";
import { Modal, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const TransparentModal = ({
  open,
  onClose,
  title,
  children,
  headerBackground,
  bgColor="bg-black",
  width="100vw",
  height="100vh",
}) => {
  const modalRef = useRef(null);

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose}>
          <div
            ref={modalRef}
            className="fixed inset-0 flex items-center justify-center  overflow-hidden"
          >
            <motion.div
              key="modal"
              initial={{ y: -90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`${bgColor}  shadow-xl outline-none ${width} ${height} overflow-y-auto rounded-xl`}
            >
              {/* Header */}
              <div className="flex justify-end items-center px-4 py-2 rounded-t-md">
                <IconButton sx={{ p: 0 }} onClick={onClose}>
                  <IoMdClose
                    className="text-white"
                    style={{
                      color: headerBackground ? "white" : "black",
                    }}
                  />
                </IconButton>
              </div>

              {/* Content */}
              <div className="p-4">{children}</div>
            </motion.div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default TransparentModal;
