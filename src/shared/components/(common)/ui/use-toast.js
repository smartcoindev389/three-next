// Inspired by react-hot-toast library
import * as React from "react";

// Toasters Icons start

const SuccessIcon = () => {
  return (
    <svg
      className={"flex-shrink-0"}
      fill="none"
      height="40"
      viewBox="0 0 40 40"
      width="40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 0C16.0444 0 12.1776 1.17298 8.8886 3.37061C5.59962 5.56823 3.03617 8.69181 1.52242 12.3463C0.00866575 16.0009 -0.387401 20.0222 0.384303 23.9018C1.15601 27.7814 3.06082 31.3451 5.85787 34.1421C8.65492 36.9392 12.2186 38.844 16.0982 39.6157C19.9778 40.3874 23.9992 39.9913 27.6537 38.4776C31.3082 36.9638 34.4318 34.4004 36.6294 31.1114C38.827 27.8224 40 23.9556 40 20C40 14.6957 37.8929 9.60859 34.1421 5.85786C30.3914 2.10714 25.3043 0 20 0ZM30.3764 15.8309L17.6491 28.5582C17.3081 28.899 16.8458 29.0905 16.3636 29.0905C15.8815 29.0905 15.4191 28.899 15.0782 28.5582L9.62364 23.1036C9.29245 22.7607 9.10918 22.3014 9.11333 21.8247C9.11747 21.348 9.30869 20.892 9.64579 20.5549C9.9829 20.2178 10.4389 20.0266 10.9156 20.0224C11.3924 20.0183 11.8516 20.2015 12.1946 20.5327L16.3636 24.7018L27.8055 13.26C28.1484 12.9288 28.6076 12.7455 29.0844 12.7497C29.5611 12.7538 30.0171 12.945 30.3542 13.2821C30.6913 13.6193 30.8825 14.0753 30.8867 14.552C30.8908 15.0287 30.7076 15.488 30.3764 15.8309Z"
        fill="#00CE9D"
      />
    </svg>
  );
};

const ErrorIcon = () => {
  return (
    <svg
      className={"flex-shrink-0"}
      fill="none"
      height="37"
      viewBox="0 0 40 37"
      width="40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M18.68 0.227853C17.0067 0.822827 17.3006 0.372291 8.49737 15.8336C3.99845 23.735 0.240557 30.4979 0.146404 30.8623C-0.256476 32.4217 0.182483 33.9554 1.33558 35.0169C2.72936 36.2999 1.23652 36.1996 19.6628 36.2479C37.7436 36.2952 37.0257 36.3302 38.3793 35.335C39.8691 34.2397 40.4393 31.9064 39.6341 30.1997C38.7667 28.3612 23.4932 1.70936 23.0376 1.23939C21.9451 0.112334 20.1662 -0.30075 18.68 0.227853ZM19.6721 8.48038C19.0419 8.66353 18.2583 9.50614 18.0174 10.2598C17.8907 10.6563 17.8578 11.334 17.9212 12.2351C17.9745 12.9895 18.1269 15.3135 18.2598 17.3995C18.5414 21.8111 18.6833 22.6819 19.227 23.3271C20.0233 24.2721 21.4408 23.8157 21.7894 22.5019C21.9831 21.7713 22.7618 13.2792 22.7618 11.8961C22.7618 10.8486 22.3622 9.4532 21.9279 8.98417C21.7467 8.78853 21.3439 8.55781 21.0328 8.47153C20.3842 8.29154 20.3208 8.29201 19.6721 8.48038ZM19.1567 26.1077C17.5645 26.9191 17.4202 29.3747 18.9107 30.2947C20.0044 30.9698 21.5574 30.6569 22.344 29.6032C22.7952 28.9985 22.7988 27.6128 22.3507 27.0134C21.5634 25.9603 20.2034 25.5746 19.1567 26.1077Z"
        fill="#F25454"
        fillRule="evenodd"
      />
    </svg>
  );
};

const SolidErrorIcon = () => {
  return (
    <svg
      fill="none"
      height="37"
      viewBox="0 0 37 37"
      width="37"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.2109 0C8.18047 0 0 8.18047 0 18.2109C0 28.2414 8.18047 36.4219 18.2109 36.4219C28.2414 36.4219 36.4219 28.2414 36.4219 18.2109C36.4219 8.18047 28.2414 0 18.2109 0ZM18.2109 34.1094C9.45234 34.1094 2.3125 26.9695 2.3125 18.2109C2.3125 9.45234 9.45234 2.3125 18.2109 2.3125C26.9695 2.3125 34.1094 9.45234 34.1094 18.2109C34.1094 26.9695 26.9695 34.1094 18.2109 34.1094Z"
        fill="white"
      />
      <path
        d="M19.3672 15.4648H17.0547V27.0273H19.3672V15.4648Z"
        fill="white"
      />
      <path
        d="M19.3672 9.97266H17.0547V12.2852H19.3672V9.97266Z"
        fill="white"
      />
    </svg>
  );
};

const AlertIcon = () => {
  return (
    <svg
      className={"flex-shrink-0"}
      fill="none"
      height="40"
      viewBox="0 0 40 40"
      width="40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M17.3283 0.112974C14.5003 0.508922 11.3299 1.71738 8.82787 3.35316C7.24899 4.38539 4.40797 7.22642 3.37574 8.80529C-0.94508 15.4143 -1.13076 23.6942 2.89206 30.3837C3.40089 31.2297 4.5702 32.7198 5.49087 33.695C13.9824 42.6906 28.4536 41.9367 35.9361 32.1089C41.1683 25.2366 41.3665 15.6739 36.4247 8.52525C35.1202 6.63836 32.3363 4.01818 30.4151 2.86948C28.6322 1.80341 26.0873 0.800304 24.1034 0.381288C22.3871 0.0189979 18.9671 -0.116577 17.3283 0.112974ZM18.4643 9.32528C17.7267 9.98614 17.4901 10.9614 17.8278 11.9481C17.9659 12.3514 18.2584 12.8277 18.4777 13.0064C18.9531 13.3939 19.998 13.6174 20.6119 13.4633C21.7692 13.1728 22.5741 11.663 22.2322 10.4246C21.7973 8.84916 19.6837 8.23255 18.4643 9.32528ZM19.052 17.6455C18.6954 17.8272 18.2274 18.2161 18.012 18.5094C17.6429 19.0122 17.6168 19.3346 17.5595 24.1117C17.4937 29.6116 17.597 30.4727 18.4127 31.2289C19.4606 32.2001 21.2469 31.9512 21.9616 30.7344C22.3262 30.1139 22.3476 29.7735 22.3476 24.5855C22.3476 18.4932 22.3425 18.4654 21.061 17.684C20.3147 17.2291 19.8847 17.2208 19.052 17.6455Z"
        fill="#F59551"
        fillRule="evenodd"
      />
    </svg>
  );
};

// Toasters Icons end

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;

  return count.toString();
}

const toastTimeouts = new Map();

/**
 * Prevents duplicate toast removal by managing toast timeouts.
 * @example
 * manageToastTimeout(toastId);
 * // Initiates a timeout for the given toastId and schedules its removal.
 * @param {string} toastId - Unique identifier for a toast notification.
 * @returns {void} This function does not return any value.
 * @description
 *   - Utilizes the toastTimeouts map to track active timeouts.
 *   - Avoids setting multiple timeouts for the same toastId.
 *   - Uses dispatch to handle the removal of a toast notification.
 *   - TOAST_REMOVE_DELAY is used to control the timing of toast removal.
 */
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Manages the state of toast notifications based on actions.
 * @example
 * reducer(state, { type: "ADD_TOAST", toast: { id: 1, message: "New toast" } })
 * // Returns new state with the added toast within the defined limit
 * @param {Object} state - The current state of the toast notifications.
 * @param {Object} action - The action object containing the type and payload for altering the toasts state.
 * @returns {Object} The updated state after applying the action.
 * @description
 *   - Limits the number of toasts to a predefined TOAST_LIMIT.
 *   - Updates existing toasts while preserving their identifiers.
 *   - Adds a side effect by invoking addToRemoveQueue during toast dismissal.
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Displays a toast notification with customizable properties.
 * @example
 * toast({ type: 'success', message: 'Operation successful' })
 * Returns an object with id, dismiss, and update methods.
 * @param {Object} {type, ...props} - An object containing the type of toast and additional properties.
 * @returns {Object} An object containing methods to manage the toast (id, dismiss, update).
 * @description
 *   - The toast notification's icon changes based on the type provided (success, error, solid_error, alert).
 *   - Generates a unique id for each toast, allowing individual updates and dismissal.
 *   - Dispatches actions to the reducer for adding, updating, and dismissing the toast.
 */
function toast({ type, ...props }) {
  const id = genId();

  const getIcon = () => {
    switch (type) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      case "solid_error":
        return <SolidErrorIcon />;
      case "alert":
        return <AlertIcon />;
      default:
        return null;
    }
  };

  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      icon: getIcon(),
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
