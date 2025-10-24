import clsx from "clsx";
import { m, useAnimationControls } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";

import type { PropsWithChildren } from "react";
import EmojiReaction from "./EmojiReaction";
import { MAX_REACTIONS_PER_SESSION } from "@/constants";

interface CounterProps {
  count: number;
}

function Counter({ count }: CounterProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    const startMotion = async () => {
      await controls.start({
        y: [-20, 0],
        transition: {
          duration: 0.18,
        },
      });
    };

    if (count !== 0) {
      startMotion();
    }
  }, [count, controls]);

  return count === 0 ? (
    <span className={clsx("flex flex-col font-mono text-sm")}>
      <span
        className={clsx(
          "flex h-5 items-center font-mono text-sm font-bold text-slate-600",
          "dark:text-slate-300"
        )}
      >
        0
      </span>
    </span>
  ) : (
    <m.span
      className={clsx(
        "flex flex-col font-mono text-sm font-bold text-slate-600",
        "dark:text-slate-300"
      )}
      animate={controls}
    >
      <span className={clsx("flex h-5 items-center")}>&nbsp;</span>
      <span className={clsx("flex h-5 items-center")}>{count}</span>
      <span className={clsx("flex h-5 items-center")}>{count - 1}</span>
    </m.span>
  );
}

type ReactionCounterProps = PropsWithChildren<CounterProps>;

function ReactionCounter({ count, children = null }: ReactionCounterProps) {
  return (
    <div
      className={clsx(
        "relative flex h-6 items-center gap-1 overflow-hidden rounded-full bg-slate-200 px-2 py-1",
        "dark:bg-[#1d263a]"
      )}
    >
      {children}
      <Counter count={count} />
    </div>
  );
}


function Reactions() {
  const { pathname } = useRouter();
  const slug = pathname.split("/").reverse()[0];

  const controls = useAnimationControls();


  return (
    <m.div
      className={clsx(
        "border-divider-light pointer-events-auto relative flex items-center justify-between rounded-xl border p-4",
        "dark:border-divider-dark"
      )}
      initial={{
        y: 16,
        opacity: 0,
        pointerEvents: "none",
      }}
      animate={controls}
    >
      <div
        className={clsx(
          "absolute inset-0 rounded-xl bg-white/70 backdrop-blur",
          "dark:bg-slate-900/80"
        )}
      />
      <div className={clsx("flex items-center gap-4")}>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <EmojiReaction
            disabled={true}
            title="Claps"
            defaultImage="/assets/emojis/clapping-hands.png"
            animatedImage="/assets/emojis/clapping-hands-animated.png"
            disabledImage="/assets/emojis/love-you-gesture.png"
            onClick={() => {
              //addReaction({ type: "CLAPPING", section: currentSection });
            }}
          />
          <ReactionCounter count={0} />
        </div>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <EmojiReaction
            disabled={false}
            title="Wow"
            defaultImage="/assets/emojis/astonished-face.png"
            animatedImage="/assets/emojis/astonished-face-animated.png"
            disabledImage="/assets/emojis/star-struck.png"
            onClick={() => {
              //addReaction({ type: "AMAZED", section: currentSection });
            }}
          />
          <ReactionCounter count={1} />
        </div>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <EmojiReaction
            disabled={true}
            title="Hmm"
            defaultImage="/assets/emojis/face-with-monocle.png"
            animatedImage="/assets/emojis/face-with-monocle-animated.png"
            disabledImage="/assets/emojis/nerd-face.png"
            onClick={() => {
              //addReaction({ type: "THINKING", section: currentSection });
            }}
          />
          <ReactionCounter count={10} />
        </div>
      </div>
    
    </m.div>
  );
}

export default Reactions;
