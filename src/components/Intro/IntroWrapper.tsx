import { Group, Modal, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useState } from 'react';
import { Logo } from '../layout/Logo';
import { IntroContent } from './IntroContent';

export default function IntroComponent() {
  // Find if the user has already seen the intro using local storage
  const [opened, setOpened] = useState(true);
  const [seenIntro, setSeenIntro] = useLocalStorage<boolean>({
    key: 'SeenIntro',
    defaultValue: false,
  });
  // If the user has seen the intro, return null
  if (!seenIntro) return null;
  // Otherwise, return the intro
  //TODO: Localisation of this modal
  return (
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
  );
}
