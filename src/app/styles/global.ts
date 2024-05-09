import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;      
    }

    :root {
        font-size: 62.5%  
    }

    body {
        background: ${({ theme }) => theme.COLORS.WHITE};
    }

    body, input, textarea, button {
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 1rem;
    }

    a { 
        text-decoration: none;
    }

    button, a {
        cursor: pointer;
        transition: 0.2s;
    }

    button:hover, a:hover {
        filter: brightness(1.1);
    }

    button:disabled {
        cursor: disabled;
    }
`;