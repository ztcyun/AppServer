import styled from "styled-components";

const StyledEmptyScreenContainer = styled.div`
  margin: 0 auto;
  padding: 50px 0;
  
	display: grid;
	grid-template-areas: 
    "img header"
    "img desc"
    "img button";
  min-width: 320px;
  max-width: 742px;

  .ec-image {
    grid-area: img;
    margin: auto 0;
  }

  .ec-header {
    grid-area: header;
  }

  .ec-desc {
    grid-area: desc; 
    padding-top: 5px;
  }

  .ec-buttons {
    grid-area: button; 
    padding-top: 10px;
  }

  @media (orientation: portrait) {
    @media (max-width: 700px) {
      .ec-image {
        height: 21vw;
      }

      .ec-header {
        font-size: 3.5vw;
      }

      .ec-desc {
        font-size: 2.4vw;
      }
    }

    @media (max-width: 480px) {
      .ec-image {
        display: none;
      }

      .ec-header {
        font-size: 4.75vw;
      }

      .ec-desc {
        font-size: 3.7vw; 
      }
    }
  }
`;

export const EmptyContentImage = styled.img.attrs(props => ({
  src: props.imageSrc,
  alt: props.imageAlt
}))`
  background: no-repeat 0 0 transparent;
`;

export default StyledEmptyScreenContainer;