import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@mui/material";
import { css } from "@emotion/react";
import { Transition, TransitionStatus } from "react-transition-group";

type DrawerProps = {
  className?: string;
  duration: number;
  mount: boolean;
  state: TransitionStatus;
  width: number;
  onClose?: VoidFunction;
};

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const [body, setBody] = React.useState<HTMLElement>();

  React.useEffect(() => {
    setBody(document.body);
  }, []);

  if (body && props.mount) {
    return ReactDOM.createPortal(
      <div
        className={props.className}
        css={css`
          inset: 0;
          position: absolute;
        `}
      >
        <div
          className="backdrop"
          css={[
            css`
              background-color: #000;
              inset: 0;
              opacity: 0.8;
              position: fixed;
              transition: opacity ${props.duration}ms;
            `,
            (props.state === "exiting" || props.state === "exited") &&
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
              transition: transform ${props.duration}ms;
              width: ${props.width}px;
            `,
            (props.state === "exiting" || props.state === "exited") &&
              css`
                transform: translateX(-${props.width}px);
              `,
          ]}
          className="container"
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

const DURATION = 1000;

const ReactTransitionGroup: React.FunctionComponent = () => {
  const [mount, setMount] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleExited = () => setMount(false);

  return (
    <>
      <Button
        onClick={() => {
          setMount(true);
          setOpen(true);
        }}
      >
        OPEN
      </Button>
      <Transition in={open} timeout={DURATION} onExited={handleExited}>
        {(state) => (
          <Drawer
            duration={DURATION}
            mount={mount}
            state={state}
            width={200}
            onClose={() => setOpen(false)}
          >
            Drawer
          </Drawer>
        )}
      </Transition>
    </>
  );
};

export default ReactTransitionGroup;
