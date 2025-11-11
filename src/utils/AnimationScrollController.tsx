"use client";
import { gsap } from "gsap";

/********
 * 
 * AnimationScrollController.tsx
 * This file provides a utility for managing animations in a React application using GSAP.
 * It allows for registering animations, playing them, and managing their state.
 * * It also provides a way to block scrolling during animations and handle callbacks.
 * 
 * 
 * ****** */


export type AnimationMethod = 'to' | 'from' | 'fromTo' | 'call';

export type AnimationElement =
  | ['call', (() => void) | null, number, string | number]
  | [AnimationMethod, gsap.TweenTarget, gsap.TweenVars]
  | [AnimationMethod, gsap.TweenTarget, gsap.TweenVars, string | number];


export interface AnimationData {
  [key: string]: AnimationElement[];
}


interface RegisteredAnimation {
  timeline: gsap.core.Timeline;
  callbackPromise: () => void;
}


export const AnimationController = (() => {


  const dataBevyAnimation: Record<string, RegisteredAnimation> = {};
  const linkMeshRefs: Record<string, gsap.TweenTarget[]> = {};
  let dataPromise: Promise<string>[] = [];
  let dataPlay: string[] = [];
  let blockDelay: number | null | boolean = null;
  let statusStart = false;
  let statusBlockScroll = false;
  ///////////////

  interface TimelineLike {
    kill?: () => void;
    constructor?: { name?: string };
  }

  function isValidTimeline(tl: unknown): tl is gsap.core.Timeline {
    return (
      !!tl &&
      typeof (tl as TimelineLike).kill === "function" &&
      (tl instanceof gsap.core.Timeline || (tl as TimelineLike).constructor?.name === "Timeline")
    );
  }
  ///////////
  function remove(name: string) {
    const entry = dataBevyAnimation[name];
    if (entry?.timeline && isValidTimeline(entry.timeline)) entry.timeline.kill();
    else console.warn(`"${name}" не є дійсним GSAP timeline`);
    delete dataBevyAnimation[name];
    delete linkMeshRefs[name];
  }

  //////////
  function clearAll() {
    Object.keys(dataBevyAnimation).forEach(remove);
  }
  /////////
  function reset() {
    statusStart = true;

    setTimeout(() => {
      //console.log("queueMicrotask blockDelay ", blockDelay);
      dataPlay.forEach((name) => {
        dataBevyAnimation[name].timeline.invalidate();
        //dataBevyAnimation[name].timeline.seek(0).play();
        dataBevyAnimation[name].timeline.restart()
        //dataBevyAnimation[name].timeline.play();
      });

      if (typeof blockDelay === "number") { /// швидка обробка скрола по таймеру (optional API)
        setTimeout(() => {
          //console.log("AnimationController reset setTimeout");
          statusStart = false;
          blockDelay = null;
          statusBlockScroll = false;
        }, blockDelay);
      }

      Promise.all(dataPromise).then(() => {
        //console.log("reset Promise");
        if (blockDelay === null) {
          /*
          nameArr.forEach((name, index) => {
            console.log("name Promise forEac", name);
            dataBevyAnimation[name].callbackPromise();
          })
            */
          statusStart = false;
          statusBlockScroll = false;
        } else {
          console.log("no NULL", blockDelay);
        }
      });

      dataPromise = [];
      dataPlay = [];
    }, 0);
  }

  return {
    register: (data: AnimationData) => {
      //console.log("AnimationController register", data);

      for (const triggerName in data) {

        if (linkMeshRefs[triggerName]) {
          console.warn('The animation name is taken:', triggerName);
          remove(triggerName);
        }

        linkMeshRefs[triggerName] = [];

        dataBevyAnimation[triggerName] = {
          timeline: gsap.timeline({
            onComplete: () => {
              dataBevyAnimation[triggerName].callbackPromise();
            },
            paused: true,
          }),
          callbackPromise: () => { },
        };

        data[triggerName].forEach((elem) => {
          // Push mesh refs only for non-'call' methods
          if (elem[0] !== 'call') {
            linkMeshRefs[triggerName].push(elem[1]);
          }
          if (elem[0] === 'call') {
            // Special handling for 'call'
            const callback = elem[1] as (() => void) | null;
            const position = elem[3] ?? ">";
            if (callback) {
              dataBevyAnimation[triggerName].timeline.call(callback, undefined, position);
            }
          } else if (elem[0] === 'to' || elem[0] === 'from' || elem[0] === 'fromTo') {

            const method = elem[0];
            const target = elem[1];
            const vars = elem[2];
            const position = elem[3] ?? ">";
            if (method === 'fromTo') {
              // For 'fromTo', vars should be [fromVars, toVars]
              if (Array.isArray(vars) && vars.length === 2) {
                dataBevyAnimation[triggerName].timeline.fromTo(
                  target,
                  vars[0],
                  vars[1],
                  position
                );
              } else {
                console.warn(`Invalid vars for 'fromTo' animation:`, vars);
              }
            } else {
              // For 'to' and 'from'
              dataBevyAnimation[triggerName].timeline[method](
                target,
                vars,
                position
              );
            }
          }
        });
      }
    },
    /////////////
    play: (name: string, callback?: () => void) => {
      if (!statusStart) reset();
      //console.log('play', dataBevyAnimation);
      if (!dataBevyAnimation[name]) {
        console.warn(`Animation "${name}" не знайдено.`);
        return;
      }
      dataPlay.push(name);

      dataPromise.push(
        new Promise<string>((resolve) => {
          dataBevyAnimation[name].callbackPromise = () => {
            if (callback) callback();
            resolve(name);
          };
        })
      );

      statusBlockScroll = true;

      return {
        focus: () => {
          // optional API
        },
      };

    },
    ////////////
    get scrollBlock() {
      return statusBlockScroll;
    },
    ///
    set scrollBlock(block: boolean | null) {
      if (typeof block === "boolean") statusBlockScroll = block;
    },
    ///
    blockDelay: (value: number | null | boolean) => {
      if (value === true) statusBlockScroll = true;
      else if (value === null) blockDelay = null;
      else if (typeof value === "number") {
        console.log("blockDelay ", (blockDelay = value));
      }
    },
    //////////
    remove,
    clearAll,
  };
})();





