import { Modal, Group, Title, Button, Stepper, Stack, Anchor } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { IconBrandDiscord } from '@tabler/icons';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { AddAppShelfItemForm } from '../components/AppShelf/AddAppShelfItem';
import { Logo } from '../components/layout/Logo';
import { useColorTheme } from '../tools/color';
import { useConfig } from '../tools/state';
import { welcomeNamespaces } from '../tools/translation-namespaces';

export default function Welcome() {
  // Find if the user has already seen the intro using local storage
  const [opened, setOpened] = useState(true);
  const [seenIntro, setSeenIntro] = useLocalStorage<boolean>({
    key: 'SeenIntro',
    defaultValue: false,
  });
  // If the user has seen the intro, return null
  if (seenIntro) return null;
  // Otherwise, return the intro
  //TODO: Localisation of this modal
  return (
    <>
      <Modal
        opened={opened}
        size="lg"
        withCloseButton
        closeOnClickOutside={false}
        closeOnEscape={false}
        radius="lg"
        centered
        onClose={() => setOpened(false)}
        title={
          <Group>
            <Title order={5}>Homarr quick guide</Title>
            <Logo withoutText size={30} style={{ marginLeft: 10 }} />
          </Group>
        }
      >
        <IntroContent setOpened={setOpened} />
      </Modal>
      <h2>Hello how are you?</h2>
    </>
  );
}

function IntroContent({ setOpened }: any) {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const { primaryColor, secondaryColor } = useColorTheme();
  useHotkeys([
    ['ArrowLeft', () => prevStep()],
    ['ArrowRight', () => nextStep()],
  ]);

  const { config, setConfig } = useConfig();

  return (
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="App creation"
          description="Creating your first app"
          allowStepSelect={active > 0}
        >
          <Stack>
            <p>
              Apps are the main part of Homarr. We will guide you through the process of creating
              your first app. You can select the type of app you want to create. Some apps have
              &quot;integrations&quot; which will enable more features. If you are interested in
              knowing all the features of Homarr, you can{' '}
              <Anchor href="https://homarr.dev/docs/modules/built-in-modules/">
                check out the documentation here
              </Anchor>
            </p>
            <AddAppShelfItemForm
              setOpened={function (b: boolean): void {
                throw new Error('Function not implemented.');
              }}
              config={config}
              setConfig={setConfig}
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email" allowStepSelect={active > 1}>
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access" allowStepSelect={active > 2}>
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          <Stack mt="xs" align="center" spacing="xs">
            <Title order={3}>Congratulations!</Title>
            <p>
              You have completed the quick guide, we hope you enjoy homarr ! If you have any
              questions feel free to ask for help in our discord server.
            </p>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button hidden={active === 3} onClick={nextStep}>
          Next step
        </Button>
        <Button hidden={active !== 3} color={secondaryColor} onClick={() => setOpened(false)}>
          Close
        </Button>
      </Group>
    </>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, welcomeNamespaces)),
      // Will be passed to the page component as props
    },
  };
}
