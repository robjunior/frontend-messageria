import "braid-design-system/reset";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root";
import seekJobsTheme from "braid-design-system/themes/seekJobs";
import { BraidProvider } from "braid-design-system";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BraidProvider theme={seekJobsTheme}>
      <Root />
    </BraidProvider>
  </StrictMode>,
);
