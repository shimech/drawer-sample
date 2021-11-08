import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@mui/material";
import { css } from "@emotion/react";
import { Transition } from "react-transition-group";

type DrawerProps = {
  beforeEnter: boolean;
  className?: string;
  duration: number;
  open: boolean;
  width: number;
  onClose?: VoidFunction;
};

const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
  const [body, setBody] = React.useState<HTMLElement>();

  React.useEffect(() => {
    setBody(document.body);
  }, []);

  if (body && props.open) {
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
            props.beforeEnter &&
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
            props.beforeEnter &&
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

const DURATION = 3000;

const ReactTransitionGroup: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);
  const [beforeEnter, setBeforeEnter] = React.useState(true);

  const handleEntering = () => setBeforeEnter(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>OPEN</Button>
      <Transition in={open} timeout={DURATION} onEntering={handleEntering}>
        {() => (
          <Drawer
            beforeEnter={beforeEnter}
            duration={DURATION}
            open={open}
            width={200}
            onClose={() => {
              setOpen(false);
              setBeforeEnter(true);
            }}
          >
            Drawer
          </Drawer>
        )}
      </Transition>
    </>
  );
};

export default ReactTransitionGroup;
