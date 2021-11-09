import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@mui/material";
import { css } from "@emotion/react";
import { Transition } from "react-transition-group";

type DrawerProps = {
  className?: string;
  duration: number;
  open: boolean;
  width: number;
  onClose?: VoidFunction;
};

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const [mount, setMount] = React.useState(false);
  const [willEnter, setWillEnter] = React.useState(true);
  const [body, setBody] = React.useState<HTMLElement>();

  React.useEffect(() => {
    if (props.open) {
      setMount(true);
    }
  }, [props.open]);

  React.useEffect(() => {
    setBody(document.body);
  }, []);

  return (
    <Transition
      in={props.open}
      timeout={props.duration}
      onEnter={() => setWillEnter(true)}
      onEntering={() => setWillEnter(false)}
      onExited={() => setMount(false)}
    >
      {(state) => {
        if (body && mount) {
          return ReactDOM.createPortal(
            <div
              className={props.className}
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
                    transition: opacity ${props.duration}ms;
                  `,
                  (willEnter || state === "exiting" || state === "exited") &&
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
                  (willEnter || state === "exiting" || state === "exited") &&
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
      }}
    </Transition>
  );
};

const ReactTransitionGroup: React.FunctionComponent = () => {
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

export default ReactTransitionGroup;
