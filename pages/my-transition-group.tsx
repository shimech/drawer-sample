import { css } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@mui/material";

type TransitionProps = {
  duration: number;
  open: boolean;
  children: (mount: boolean, willEnter: boolean) => React.ReactElement | null;
};

const Transition = (props: TransitionProps) => {
  const [mount, setMount] = React.useState(false);
  const [willEnter, setWillEnter] = React.useState(true);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (props.open) {
      setWillEnter(true);
      setMount(true);
    } else {
      timeout = setTimeout(() => setMount(false), props.duration);
    }

    return () => clearTimeout(timeout);
  }, [props.open, props.duration]);

  React.useEffect(() => {
    if (mount) {
      setWillEnter(false);
    }
  }, [mount]);

  return props.children(mount, willEnter);
};

type DrawerProps = Omit<TransitionProps, "children"> & {
  width: number;
  onClose?: VoidFunction;
};

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const [body, setBody] = React.useState<HTMLElement>();
  React.useEffect(() => {
    setBody(document.body);
  }, []);

  return (
    <Transition duration={props.duration} open={props.open}>
      {(mount, willEnter) => {
        if (body && mount) {
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
                    transition: opacity ${props.duration}ms;
                  `,
                  (!props.open || willEnter) &&
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
                  (!props.open || willEnter) &&
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
