import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, text, color } from "@storybook/addon-knobs/react";
import withReadme from "storybook-readme/with-readme";
import Readme from "./README.md";
import HelpButton from ".";
import Section from "../../../.storybook/decorators/section";
import Text from "../text";
import Link from "../link";
import styled from "styled-components";

const IconButtons = styled.div`
  margin-top: 150px;
  margin-left: 70px;
  display: flex;

  .icon-button {
    margin-left: 10px;
  }
`;

storiesOf("Components|Buttons", module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(Readme))
  .add("help button", () => {
    return (
      <Section>
        <IconButtons>
          <HelpButton
            displayType="dropdown"
            offsetTop={number("offsetTop", 0)}
            offsetRight={number("offsetRight", 0)}
            offsetBottom={number("offsetBottom", 0)}
            offsetLeft={number("offsetLeft", 0)}
            size={number("size", 13)}
            iconName={text("iconName", "QuestionIcon")}
            color={color("color", "")}
            tooltipContent={
              <Text fontSize='13px'>
                Paste you tooltip content here
              </Text>
            }
          />
          <HelpButton
            displayType="aside"
            helpButtonHeaderContent="Aside position HelpButton"
            size={number("size", 13)}
            iconName={text("iconName", "QuestionIcon")}
            color={color("color", "")}
            tooltipContent={
              <Text>
                You tooltip content with{" "}
                <Link
                  isHovered={true}
                  href="http://localhost:6006/?path=/story/components-buttons--help-button"
                >
                  link
                </Link>
              </Text>
            }
          />
          <HelpButton
            displayType="auto"
            helpButtonHeaderContent="Auto position HelpButton"
            size={number("size", 13)}
            iconName={text("iconName", "QuestionIcon")}
            color={color("color", "")}
            tooltipContent={
              <>
                <p>You can put every thing here</p>
                <ul style={{ marginBottom: 0 }}>
                  <li>Word</li>
                  <li>Chart</li>
                  <li>Else</li>
                </ul>
              </>
            }
          />
        </IconButtons>
      </Section>
    );
  });
