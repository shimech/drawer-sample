import React from "react";
import { Button, Drawer } from "@mui/material";

const MaterialUI: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        Drawer
      </Drawer>
    </>
  );
};

export default MaterialUI;
