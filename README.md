# 📖 Litra Hub

Litra Hub is a platform dedicated to providing high-quality light novel translations for enthusiasts. Our goal is to offer a comfortable and enjoyable reading experience, allowing users to dive into captivating stories from various authors.

## Features

*   **Light Novel Browsing:** Explore a collection of light novels with cover images and synopsis.
*   **Responsive Reading Experience:** Read novels seamlessly on both desktop and mobile devices.
*   **Multiple Reading Modes:** Switch between paginated view (page-by-page) and scroll view for a personalized reading experience.
*   **Volume Navigation:** Easily navigate between different volumes of a novel.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm/bun) installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/akariwill/Akari-Translations.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Akari-Translations
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    # or bun install
    ```

### Running the Development Server

```bash
npm run dev
# or yarn dev
# or pnpm dev
# or bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding New Novels

To add a new light novel:

1.  Create a new folder for the novel inside `public/novels/`. The folder name will be used as the novel's title.
    Example: `public/novels/My-Awesome-Novel`
2.  Place the PDF files for each volume inside the novel's folder.
    Example: `public/novels/My-Awesome-Novel/Volume 1.pdf`
3.  Add a cover image (e.g., `cover.jpg`, `cover.png`) to the novel's folder. The file name should contain "cover".
    Example: `public/novels/My-Awesome-Novel/cover.jpg`
4.  Create a `synopsis.json` file inside the novel's folder with the following format:
    ```json
    {
      "synopsis": "Your novel's synopsis goes here."
    }
    ```

## Contact

If you have any questions, feedback, or suggestions, feel free to reach out:

*   **Email:** mwildjrs23@gmail.com
*   **GitHub:** [https://github.com/akariwill/Akari-Translations](https://github.com/akariwill/Akari-Translations)

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).