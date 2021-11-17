import { css } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@mui/material";

type TransitionContextValue = {
  duration: number;
  mount: boolean;
  open: boolean;
  willEnter: boolean;
};

const TransitionContext = React.createContext<TransitionContextValue>({
  duration: 0,
  mount: false,
  open: false,
  willEnter: true,
});

type TransitionProps = Omit<TransitionContextValue, "mount" | "willEnter"> & {};

const Transition: React.FunctionComponent<TransitionProps> = (props) => {
  const [value, setValue] = React.useState<TransitionContextValue>({
    duration: props.duration,
    mount: false,
    open: props.open,
    willEnter: true,
  });

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    setValue((prevValue) => ({ ...prevValue, open: props.open }));
    if (props.open) {
      setValue((prevValue) => ({ ...prevValue, mount: true, willEnter: true }));
    } else {
      timeout = setTimeout(
        () => setValue((prevValue) => ({ ...prevValue, mount: false })),
        value.duration
      );
    }

    return () => clearTimeout(timeout);
  }, [props.open, value.duration]);

  React.useEffect(() => {
    if (value.mount) {
      setValue((prevValue) => ({ ...prevValue, willEnter: false }));
    }
  }, [value.mount]);

  React.useEffect(() => {
    setValue((prevValue) => ({ ...prevValue, duration: props.duration }));
  }, [props.duration]);

  return (
    <TransitionContext.Provider value={value}>
      {props.children}
    </TransitionContext.Provider>
  );
};

type DrawerContentProps = {
  width: number;
  onClose?: VoidFunction;
};

const DrawerContent: React.FunctionComponent<DrawerContentProps> = (props) => {
  const [body, setBody] = React.useState<HTMLElement>();
  const value = React.useContext(TransitionContext);

  React.useEffect(() => {
    setBody(document.body);
  }, []);

  if (body && value.mount) {
    return ReactDOM.createPortal(
      <div
        css={css`
          inset: 0;
          position: absolute;
        `}
      >
        <div
          css={[
            css`
              background-color: #000;
              inset: 0;
              opacity: 0.8;
              position: fixed;
              transition: opacity ${value.duration}ms;
            `,
            (!value.open || value.willEnter) &&
              css`
                opacity: 0;
              `,
          ]}
          onClick={props.onClose}
        />
        <div
          css={[
            css`
              background-color: #fff;
              inset: 0;
              height: 100vh;
              position: absolute;
              transform: none;
              transition: transform ${value.duration}ms;
              width: ${props.width}px;
            `,
            (!value.open || value.willEnter) &&
              css`
                transform: translateX(-${props.width}px);
              `,
          ]}
        >
          {props.children}
        </div>
      </div>,
      body
    );
  } else {
    return null;
  }
};

type DrawerProps = TransitionProps & DrawerContentProps;

const Drawer: React.FunctionComponent<DrawerProps> = (props) => (
  <Transition duration={props.duration} open={props.open}>
    <DrawerContent width={props.width} onClose={props.onClose}>
      {props.children}
    </DrawerContent>
  </Transition>
);

const MyTransitionGroup: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>OPEN</Button>
      <Drawer
        duration={1000}
        open={open}
        width={200}
        onClose={() => setOpen(false)}
      >
        Drawer
      </Drawer>
    </>
  );
};

export default MyTransitionGroup;
