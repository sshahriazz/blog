import Document, { DocumentContext } from "next/document";
import { ServerStyles, createStylesServer } from "@mantine/next";

import { resetServerContext } from "react-beautiful-dnd";

const stylesServer = createStylesServer();

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    resetServerContext();

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles
          html={initialProps.html}
          server={stylesServer}
          key="styles"
        />,
      ],
    };
  }
}
