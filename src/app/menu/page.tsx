"use client";

import { Header } from "@/components/Header";
import { Container, Content, MenuTitle, MenuWrapper } from "./styles";
import { Modal } from "@/components/Modal";
import { MenuOptions } from "./components/MenuOption";
import { useRouter } from "next/navigation";
import { useUser } from "../hooks/userContext";
import { LoginApiResponseType } from "@/@types";
import { useEffect, useState } from "react";
import { WarningModal } from "@/components/WarningModal";
import { Warning } from "phosphor-react";
import { defaultTheme } from "../styles/theme/default";

export default function Menu() {
  const navigator = useRouter();
  const { saveUser, checkExpiredToken, signOut } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [triggerFunction, setTriggerFunction] = useState(() => () => {});
  const [buttonText, setButtonText] = useState("Proceed");

  function navigateToDestinyRoute(route: string) {
    navigator.push(route);
  }

  function defineWarmingModalProps(
    message: string,
    buttonText: string,
    functionToTrigger: () => void
  ) {
    setErrorMessage(message);
    setButtonText(buttonText);
    setShowModal(true);
    setTriggerFunction(() => () => functionToTrigger());
  }

  async function checkAccountConfiguration() {
    const config = await localStorage.getItem("@pcr-translator:config");

    if (!config) {
      defineWarmingModalProps(
        "Seems like you didn't configure your account preferences yet, please configure it so you can use all the services from our app properly!",
        "Proceed",
        () => {
          navigator.push("/userconfig");
        }
      );
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("@pcr-translator:user");

    if (user) {
      const userObj: LoginApiResponseType = JSON.parse(user);
      saveUser(userObj);
      const loginDate = new Date(userObj.loginDate);

      if (checkExpiredToken(loginDate)) {
        signOut();
        navigator.replace("/");
      }
    } else {
      signOut();
      navigator.replace("/");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => checkAccountConfiguration(), 700);
  }, []);

  const MenuComponent = () => {
    return (
      <>
        <MenuTitle>Maintenance Options</MenuTitle>
        <MenuWrapper>
          <MenuOptions
            isReady
            title={"ZeroBounce Email Verification"}
            onClick={() => navigateToDestinyRoute("/emailcheck")}
            tutorialLink="https://www.loom.com/share/486922aea8bf467994031d86b20b4191?sid=f81e80a9-202b-457d-8efd-5387b1403b5d"
          />

          <MenuOptions
            isReady
            title={"Linkedin Link Duplication Check"}
            onClick={() => navigateToDestinyRoute("/linkedincheck")}
            tutorialLink="https://www.loom.com/share/03969a18955e49deb12b0946029a646a?sid=8c68f57d-7e16-41b5-abc1-2ea4add07e94"
          />
          <MenuOptions
            isReady
            title={"Normalize First and Last Name"}
            onClick={() => navigateToDestinyRoute("/namescorrection")}
            tutorialLink="https://www.loom.com/share/c901de215d634865b5b39080d2f3c876?sid=152c209b-872c-42c5-b301-c53688c7e068"
          />
          <MenuOptions
            isReady
            title={"Filter Emails Domains "}
            onClick={() => navigateToDestinyRoute("/emaildomaincheck")}
            tutorialLink="https://www.loom.com/share/39a154408b9b4a7795068b7de25030da?sid=3caf7b12-018d-4394-996e-1b37fbb7ba65"
          />
          <MenuOptions
            isReady
            title={"Format Job Description"}
            onClick={() => navigateToDestinyRoute("/formatjobdescription")}
            tutorialLink=""
          />
          <MenuOptions
            isReady
            title={"Activities"}
            onClick={() => navigateToDestinyRoute("/activities")}
            tutorialLink=""
          />
          {/* <MenuOptions
            isReady
            title={"GoogleSheet"}
            onClick={() => navigateToDestinyRoute("/googleSheet")}
            tutorialLink=""
          /> */}
        </MenuWrapper>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Menu !"} />
      <WarningModal
        showModal={showModal}
        icon={<Warning size={36} color={defaultTheme.COLORS.PRIMARY} />}
        text={errorMessage}
        primaryButtonText={buttonText}
        secondaryButtonText="Cancel"
        onConfirm={triggerFunction}
        onCancel={() => setShowModal(false)}
      />
      <Content>
        <Modal content={<MenuComponent />} />
      </Content>
    </Container>
  );
}
