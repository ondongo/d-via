import { Modal } from "@/components/atoms/ui/modals/CustomModal";
import React, { useState } from "react";

function DevisAnalyse() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <>
      <button
        onClick={() => openModal()}
        className="my-5 text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center gap-2"
      >
        <img src="/icons/draft.svg" alt="Icône draft" className="w-4 h-4" />
        Analyser votre devis
      </button>

      <Modal
        onClose={closeModal}
        title={"Analyser votre devis"}
        isOpen={modalOpen}
        className="w-[750px]"
      >
        <div className="flex flex-col gap-4 w-[750px] overflow-hidden items-center p-10">
          <div className="w-full mb-5">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center py-9 w-full border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-dvianeutral-96 hover:border-dvianeutral-40"
            >
              <div className="mb-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <g id="Upload 02">
                    <path
                      id="icon"
                      d="M16.296 25.3935L19.9997 21.6667L23.7034 25.3935M19.9997 35V21.759M10.7404 27.3611H9.855C6.253 27.3611 3.33301 24.4411 3.33301 20.8391C3.33301 17.2371 6.253 14.3171 9.855 14.3171V14.3171C10.344 14.3171 10.736 13.9195 10.7816 13.4326C11.2243 8.70174 15.1824 5 19.9997 5C25.1134 5 29.2589 9.1714 29.2589 14.3171H30.1444C33.7463 14.3171 36.6663 17.2371 36.6663 20.8391C36.6663 24.4411 33.7463 27.3611 30.1444 27.3611H29.2589"
                      stroke="#e5451d"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                  </g>
                </svg>
              </div>
              <h2 className="text-center text-gray-400   text-xs font-normal leading-4 mb-1">
                Format PDF, PNG ou JPG, moins de 50MB
              </h2>
              <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                Glissez votre devis ici ou{" "}
                <span className="text-dviaprimary-40">
                  choisissez un fichier
                </span>
              </h4>
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>

          <div className="w-full grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <g id="Folder Open ">
                    <path
                      id="icon"
                      d="M5 28.3333V14.8271C5 10.2811 5 8.00803 6.36977 6.56177C6.43202 6.49604 6.49604 6.43202 6.56177 6.36977C8.00803 5 10.2811 5 14.8271 5H15.3287C16.5197 5 17.1151 5 17.6492 5.18666C17.9753 5.30065 18.2818 5.46465 18.5575 5.67278C19.0091 6.0136 19.3394 6.50907 20 7.5C20.6606 8.49093 20.9909 8.9864 21.4425 9.32722C21.7182 9.53535 22.0247 9.69935 22.3508 9.81334C22.8849 10 23.4803 10 24.6713 10H28.3333C31.476 10 33.0474 10 34.0237 10.9763C35 11.9526 35 13.524 35 16.6667V17.5M16.2709 35H25.8093C28.2565 35 29.4801 35 30.3757 34.3164C31.2714 33.6328 31.5942 32.4526 32.2398 30.0921L32.6956 28.4254C33.7538 24.5564 34.2829 22.622 33.2823 21.311C32.2817 20 30.2762 20 26.2651 20H16.7339C14.2961 20 13.0773 20 12.1832 20.6796C11.2891 21.3591 10.9629 22.5336 10.3105 24.8824L9.84749 26.549C8.76999 30.428 8.23125 32.3675 9.23171 33.6838C10.2322 35 12.2451 35 16.2709 35Z"
                      stroke="#e5451d"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                  </g>
                </svg>
                <div className="grid gap-1">
                  <h4 className="text-gray-900 text-sm font-normal leading-snug">
                    General Documents.pdf
                  </h4>
                  <h5 className="text-gray-400   text-xs font-normal leading-4">
                    23 secondes restantes
                  </h5>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g id="Upload 3">
                  <path
                    id="icon"
                    d="M15 9L12 12M12 12L9 15M12 12L9 9M12 12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#e5451d"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </g>
              </svg>
            </div>
            <div className="relative flex items-center gap-2.5 py-1.5">
              <div className="relative  w-full h-2.5  overflow-hidden rounded-3xl bg-white">
                <div
                  role="progressbar"
                  aria-valuenow={80}
                  aria-valuemin={0}
                  aria-valuemax={80}
                  style={{ width: "80%" }}
                  className="flex h-full items-center justify-center bg-dviaprimary-60  text-white rounded-3xl"
                ></div>
              </div>
              <span className="ml-2 bg-white p-1 px-2  rounded-full  text-gray-800 text-xs font-medium flex justify-center items-center ">
                80%
              </span>
            </div>
          </div>
          <div className="w-full flex justify-end mt-8">
            <button className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px]">
              Lancer l&apos;analyse
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DevisAnalyse;
