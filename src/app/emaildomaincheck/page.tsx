"use client";
import {
  CandidatesProps,
  LoginApiResponseType,
  SelectOptionsProps,
} from "@/@types";

import {
  Container,
  Content,
  ErrorMessage,
  FinalFeedbackWrapper,
  Form,
  StyledSelect,
  Title,
} from "./styles";

import { useEffect, useState } from "react";
import { useUser } from "../hooks/userContext";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { Modal } from "@/components/Modal";
import { LoadingPlaceholder } from "@/components/LoadingPlaceholder";
import { Button } from "@/components/Button";
import { CustomInput } from "@/components/CustomInput";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createListonPcrSystem, fetchPcrRecords, populatePcrList } from "@/utils/apiTools";
import {
  createRollUpList,
  insertRecordOnRollUpList,
} from "@/services/PCR/rollupService";

const emailCheckFormSchema = yup.object({
  targetListCode: yup.string().required(),
  personalDomainListName: yup.string().required(),
  businessDomainListName: yup.string().required(),
});

interface EmailDomainCheckFormData {
  targetListCode: string;
  personalDomainListName: string;
  businessDomainListName: string;
}

export default function EmailDomainCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState(1);
  const [emailType, setEmailType] = useState<
    "Work Email" | "Personal Email" | null
  >(null);

  const { saveUser, signOut, checkExpiredToken, user } = useUser();
  const navigator = useRouter();

  const options: SelectOptionsProps[] = [
    { value: "Work Email", label: "Work Email" },
    { value: "Personal Email", label: "Personal Email" },
  ];

  const mostCommonPersonalEmailDomains = [
    "@126.com",
    "@1drv.ms",
    "@aim.com",
    "@alice.it",
    "@aliceadsl.fr",
    "@aol.com",
    "@arcor.de",
    "@att.net",
    "@bellsouth.net",
    "@bigpond.com",
    "@bigpond.net.au",
    "@bluewin.ch",
    "@blueyonder.co.uk",
    "@bol.com.br",
    "@campaign-archive.com",
    "@cehennempass.pw",
    "@centurytel.net",
    "@charter.net",
    "@chello.nl",
    "@club-internet.fr",
    "@cmail19.com",
    "@cmail20.com",
    "@comcast.net",
    "@convertkit-mail2.com",
    "@cox.net",
    "@cybermail.jp",
    "@deref-mail.com",
    "@dripemail2.com",
    "@earthlink.net",
    "@evite.com",
    "@facebook.com",
    "@families.google",
    "@fastmail.com",
    "@free.fr",
    "@freemail.hu",
    "@freenet.de",
    "@frontiernet.net",
    "@gmail.com",
    "@gmx.ch",
    "@gmx.com",
    "@gmx.de",
    "@gmx.fr",
    "@gmx.net",
    "@googlemail.com",
    "@greetingsisland.com",
    "@gxcorner.games",
    "@hao6v.tv",
    "@hetnet.nl",
    "@home.nl",
    "@hotmail.co.uk",
    "@hotmail.com",
    "@hotmail.de",
    "@hotmail.es",
    "@hotmail.fr",
    "@hotmail.it",
    "@hushmail.com",
    "@ig.com.br",
    "@instantly.ai",
    "@juno.com",
    "@kpnmail.nl",
    "@laposte.net",
    "@libero.it",
    "@linkedinmobileapp.com",
    "@list-manage.com",
    "@live.ca",
    "@live.co.uk",
    "@live.com",
    "@live.com.au",
    "@live.fr",
    "@live.it",
    "@live.net",
    "@live.nl",
    "@liveinternet.ru",
    "@mac.com",
    "@mail.bg",
    "@mail.com",
    "@mail.ee",
    "@mail.ru",
    "@mailchi.mp",
    "@mailchimp.com",
    "@me.com",
    "@mimecast.com",
    "@mlsend.com",
    "@msn.com",
    "@neuf.fr",
    "@ntlworld.com",
    "@odido.nl",
    "@optonline.net",
    "@optusnet.com.au",
    "@orange.fr",
    "@outlook.com",
    "@planet.nl",
    "@posteo.de",
    "@qq.com",
    "@rambler.ru",
    "@rediffmail.com",
    "@rocketmail.com",
    "@sbcglobal.net",
    "@sendgrid.net",
    "@sfr.fr",
    "@shaw.ca",
    "@sky.com",
    "@skynet.be",
    "@sympatico.ca",
    "@szn.cz",
    "@t-online.de",
    "@telenet.be",
    "@temp-mail.org",
    "@terra.com.br",
    "@tin.it",
    "@tiscali.co.uk",
    "@tiscali.it",
    "@uol.com.br",
    "@verizon.net",
    "@virgilio.it",
    "@voila.fr",
    "@wanadoo.fr",
    "@web.de",
    "@webmail.free.fr",
    "@windstream.net",
    "@yahoo.ca",
    "@yahoo.co.id",
    "@yahoo.co.in",
    "@yahoo.co.jp",
    "@yahoo.co.uk",
    "@yahoo.com",
    "@yahoo.com.ar",
    "@yahoo.com.au",
    "@yahoo.com.br",
    "@yahoo.com.mx",
    "@yahoo.com.sg",
    "@yahoo.de",
    "@yahoo.es",
    "@yahoo.fr",
    "@yahoo.in",
    "@yahoo.it",
    "@yahoomail.com",
    "@yandex.ru",
    "@ymail.com",
    "@yopmail.com",
    "@zonnet.nl",
  ];

  function verifyDomain(
    candidate: string,
    emailType: "Work Email" | "Personal Email"
  ) {}

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailDomainCheckFormData>({
    resolver: yupResolver(emailCheckFormSchema),
  });

  const handleEmailTypeChange = () => {
    setEmailType(emailType === "Work Email" ? "Personal Email" : "Work Email");
  };

  function checkEmailDomain(email: string) {
    const emailDomain = email.substring(email.indexOf("@"));
    return mostCommonPersonalEmailDomains.includes(emailDomain);
  }

  async function handleForm({
    targetListCode,
    personalDomainListName,
    businessDomainListName,
  }: EmailDomainCheckFormData) {
    try {
      setIsLoading(true);
      let personalEmailDomainCandidates = [] as CandidatesProps[];
      let workEmailDomainCandidates = [] as CandidatesProps[];
      let businessDomainCandidates = [] as CandidatesProps[];

      if (emailType === null) throw new Error("Please select email type");

      const candidates = await fetchPcrRecords(
        targetListCode,
        ["Candidate.EmailAddress", "CandidateId", "Candidate.CustomFields"],
        user.SessionId
      );

      setSteps(2);

      candidates.Results.forEach((candidate: CandidatesProps) => {
        switch (emailType) {
          case "Work Email":
            const workEmailField = candidate.Candidate.CustomFields!.find(
              (field) => field.FieldName === "Email_Work"
            );

            if (workEmailField && checkEmailDomain(workEmailField.Value[0])) {
              workEmailDomainCandidates = [
                ...workEmailDomainCandidates,
                candidate,
              ];
            } else {
              businessDomainCandidates = [
                ...businessDomainCandidates,
                candidate,
              ];
            }
            break;
          case "Personal Email":
            if (checkEmailDomain(candidate.Candidate.EmailAddress!)) {
              personalEmailDomainCandidates = [
                ...personalEmailDomainCandidates,
                candidate,
              ];
            } else {
              businessDomainCandidates = [
                ...businessDomainCandidates,
                candidate,
              ];
            }
            break;
          default:
            throw new Error("Invalid email type");
        }
      });

      setSteps(3);

      const personalDomainListCode = await createListonPcrSystem(
        user.Login,
        personalDomainListName,
        "This list contains users with personal email domains",
        user.SessionId
      );
      const businessDomainListCode = await createListonPcrSystem(
        user.Login,
        businessDomainListName,
        "This list contains candidates with business email domains",
        user.SessionId
      );

    setSteps(4);

     await populatePcrList(personalEmailDomainCandidates, user.SessionId, personalDomainListCode)
     await populatePcrList(businessDomainCandidates, user.SessionId, businessDomainListCode)

     setSteps(5);
      // reset();
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
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

  if (isLoading) {
    switch (steps) {
      case 1:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder
                message={"Fetching candidates from PCR list..."}
              />
            </Content>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder
                message={
                  "Separating candidates with business email domains from personal domains..."
                }
              />
            </Content>
          </Container>
        );
      case 3:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder message={"Creating lists on PCR system..."} />
            </Content>
          </Container>
        );
      case 4:
        return (
          <Container>
            <Header title={"Wellcome to PCR Trasnslator !"} />
            <Content>
              <LoadingPlaceholder message={"Populating your lists..."} />
            </Content>
          </Container>
        );
      default:
        return (
          <Container>
            <Header title={"Linkedin Check !"} />
            <Content>
              <FinalFeedbackWrapper>
                <span>
                  {`Awesome, everything went right!! 
                  Check your PCR System and you will see your new roll up list updated

                  Ps: You might have to refresh your PCR rollup list page to see the changes
                  `}
                </span>
                <Button
                  title={"Start Again"}
                  isLoading={false}
                  onClick={() => {
                    setSteps(1);
                    setIsLoading(false);
                  }}
                />
                <Button
                  title={"Go to menu"}
                  isLoading={false}
                  onClick={() => {
                    navigator.back();
                  }}
                />
              </FinalFeedbackWrapper>
            </Content>
          </Container>
        );
    }
  }

  const FormComponent = () => {
    return (
      <>
        <Title>Filter Email Domains</Title>
        <Form onSubmit={handleSubmit(handleForm)}>
          <CustomInput
            placeholder={"Target List Code"}
            label={"Target List Code"}
            {...register("targetListCode")}
          />
          {errors.targetListCode && (
            <ErrorMessage>{errors.targetListCode.message}</ErrorMessage>
          )}
          <CustomInput
            placeholder={"Personal Domain List Name"}
            label={"List With Personal Domain Candidates"}
            {...register("personalDomainListName")}
          />
          {errors.personalDomainListName && (
            <ErrorMessage>{errors.personalDomainListName.message}</ErrorMessage>
          )}
          <CustomInput
            placeholder={"List With Business Domain Candidates"}
            label={"Business Domain List Name"}
            {...register("businessDomainListName")}
          />
          {errors.businessDomainListName && (
            <ErrorMessage>{errors.businessDomainListName.message}</ErrorMessage>
          )}
          <StyledSelect
            options={options}
            onChange={handleEmailTypeChange}
            value={options.find((option) => option.value === emailType)}
          />
           
          <Button
            title={"Start Checking"}
            type="submit"
            isLoading={isLoading}
          />
        </Form>
      </>
    );
  };

  return (
    <Container>
      <Header title={"Filter Email Domain!"} />
      <Content>
        <Modal content={<FormComponent />} />
      </Content>
    </Container>
  );
}
