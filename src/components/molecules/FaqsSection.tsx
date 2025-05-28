import React from "react";

function FaqsSection() {
  return (
    <section>
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <h4 className="text-4xl md:text-[40px] leading-display-medium tracking-display-medium font-bold  text-dvianeutral-10 ">
          Questions fréquentes
        </h4>
        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small  tracking-headline-small  mb-5">
          Voici les questions les plus fréquentes que se posent nos artisans.
        </p>

        <div className="space-y-4 min-w-[722px] max-w-[722px]">
          <details
            className="group [&_summary::-webkit-details-marker]:hidden "
            open
          >
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-dvianeutralvariant-50 bg-transparent p-4 text-dvianeutral-10 cursor-pointer ">
              <h2 className="text-lg font-medium">
                Combien coûte l'inscription sur la plateforme ?
              </h2>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="block size-5 shrink-0 group-open:hidden"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="hidden size-5 shrink-0 group-open:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </summary>

            <p className="px-4 pt-4 text-dvianeutral-10">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className=" cursor-pointer flex items-center justify-between gap-1.5 rounded-md border border-dvianeutralvariant-50 bg-transparent p-4 text-dvianeutral-10 ">
              <h2 className="text-lg font-medium">
                Comment sont vérifiés les profils des artisans ?
              </h2>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="block size-5 shrink-0 group-open:hidden"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="hidden size-5 shrink-0 group-open:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </summary>

            <p className="px-4 pt-4 text-dvianeutral-10">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className=" cursor-pointer flex items-center justify-between gap-1.5 rounded-md border border-dvianeutralvariant-50 bg-transparent p-4 text-dvianeutral-10 ">
              <h2 className="text-lg font-medium">
                Puis-je choisir ma zone d'intervention ?
              </h2>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="block size-5 shrink-0 group-open:hidden"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="hidden size-5 shrink-0 group-open:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </summary>

            <p className="px-4 pt-4 text-dvianeutral-10">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
              veritatis molestias culpa in, recusandae laboriosam neque aliquid
              libero nesciunt voluptate dicta quo officiis explicabo
              consequuntur distinctio corporis earum similique!
            </p>
          </details>
        </div>

        <h4 className="text-headline-large leading-headline-large tracking-headline-large  font-bold  text-dvianeutral-10 mt-4">
          Vous avez encore des questions ?
        </h4>
        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small  tracking-headline-small  mb-2">
          Trouvez des réponses à vos questions auprès de nous.
        </p>
        <button
          className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-12px border-transparent text-sm font-medium
               hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px]  max-h-[40px]"
        >
          Discuter avec nous
        </button>
      </div>
    </section>
  );
}

export default FaqsSection;
