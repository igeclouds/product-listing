import {
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Stack,
  Table,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Config, Global, PrismaClient } from '@prisma/client';
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { dashboardNamespaces } from '../tools/translation-namespaces';

export default function NewConfig(props: {
  configs: (Config & {
    globals: Global;
  })[];
}) {
  const [configs, setConfigs] = useState(props.configs);
  const form = useForm({
    initialValues: {
      name: '',
      darkMode: false,
    },
  });
  // Make a form to add a config to the database. Show a table of all the configs below the form.
  return (
    <Stack>
      <Box sx={{ maxWidth: 500, minWidth: 500 }} mx="auto" mt={20}>
        <form
          onSubmit={form.onSubmit((values) =>
            axios
              .post('/api/database/config', values)
              .then((res) => {
                console.log(res.data);
                // TODO: Don't do that, it's bad.
                setConfigs([...configs, res.data]);
              })
              .catch((err) => {
                // Send notification
                showNotification({
                  title: 'Error',
                  message: err.response.data.message,
                  color: 'red',
                });
              })
          )}
        >
          <TextInput
            withAsterisk
            label="Name"
            placeholder="your@name"
            {...form.getInputProps('name')}
          />

          <Checkbox
            mt="md"
            label="Dark mode ?"
            {...form.getInputProps('darkMode', { type: 'checkbox' })}
          />
          <Group position="center" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
        <Table withBorder>
          <thead>
            <tr>
              <th>Name</th>
              <th>Drak mode</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((config) => (
              <tr key={config.id}>
                <td>{config.name}</td>
                <td>
                  <Checkbox readOnly checked={config.globals.darkMode} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Stack>
  );
}

export async function getServerSideProps({ req, res, locale }: GetServerSidePropsContext): Promise<{
  props: {
    configs: (Config & {
      globals: Global;
    })[];
  };
}> {
  const prisma = new PrismaClient();
  let configName = getCookie('config-name', { req, res });
  const configLocale = getCookie('config-locale', { req, res });
  if (!configName) {
    setCookie('config-name', 'default', {
      req,
      res,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'strict',
    });
    configName = 'default';
  }
  const configs = await prisma.config.findMany({
    include: {
      globals: true,
    },
  });

  const translations = await serverSideTranslations(
    (configLocale ?? locale) as string,
    dashboardNamespaces
  );
  // Initialize the prisma client
  return {
    props: {
      configs,
    },
  };
}
