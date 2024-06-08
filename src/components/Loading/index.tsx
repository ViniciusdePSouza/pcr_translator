import { Container, Loader } from "./style";

export function Loading() {
  return (
    <Container>
      <h1>
        Just a second, we're syncing your pcr information with our system...{" "}
      </h1>
      <Loader />
    </Container>
  );
}
