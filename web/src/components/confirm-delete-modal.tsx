// components/ConfirmDeleteModal.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  message = 'Tem certeza que deseja excluir este item? Esta ação não poderá ser desfeita.'
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void,
  message?: string 
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} open={isOpen}>
        <Transition
          show={isOpen}
          enter="ease-out duration-300" 
          enterFrom="opacity-0" 
          enterTo="opacity-100"
          leave="ease-in duration-200" 
          leaveFrom="opacity-100" 
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition
              show={isOpen}
              enter="ease-out duration-300" 
              enterFrom="opacity-0 scale-95" 
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" 
              leaveFrom="opacity-100 scale-100" 
              leaveTo="opacity-0 scale-95"
            >
              <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <h3 className="text-lg font-medium text-gray-900">
                  Confirmar exclusão
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
