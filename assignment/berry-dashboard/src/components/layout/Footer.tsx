export default function Footer() {
  return (
    <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[14px] leading-[18.676px] text-berry-text">
        © All rights reserved{" "}
        <a href="https://codedthemes.com/" className="text-berry-primary hover:underline">
          CodedThemes
        </a>
      </p>
      <div className="flex flex-wrap gap-4 text-[14px] text-berry-muted">
        <a href="https://mui.com/store/license/" className="hover:text-berry-primary">
          License
        </a>
        <a href="https://codedthemes.com/hire-us/" className="hover:text-berry-primary">
          Hire us
        </a>
        <a href="https://mui.com/store/terms/" className="hover:text-berry-primary">
          Terms
        </a>
        <a href="https://links.codedthemes.com/dAAOP" className="hover:text-berry-primary">
          Figma Design System
        </a>
      </div>
    </div>
  );
}
