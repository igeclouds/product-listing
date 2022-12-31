import { Button, Group, MultiSelect, Stack, Switch, TextInput } from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Widgets from '../../../../widgets';
import type { IWidgetOptionValue } from '../../../../widgets/widgets';
import { useConfigContext } from '../../../../config/provider';
import { useConfigStore } from '../../../../config/store';
import { IWidget } from '../../../../widgets/widgets';

export type WidgetEditModalInnerProps = {
  widgetId: string;
  options: IWidget<string, any>['properties'];
};

type IntegrationOptionsValueType = IWidget<string, any>['properties'][string];

export const WidgetsEditModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<WidgetEditModalInnerProps>) => {
  const { t } = useTranslation([`modules/${innerProps.widgetId}`, 'common']);
  const [moduleProperties, setModuleProperties] = useState(innerProps.options);
  const items = Object.entries(moduleProperties ?? {}) as [string, IntegrationOptionsValueType][];

  // Find the Key in the "Widgets" Object that matches the widgetId
  const currentWidgetDefinition = Widgets[innerProps.widgetId as keyof typeof Widgets];
  const { name: configName } = useConfigContext();
  const updateConfig = useConfigStore((x) => x.updateConfig);

  if (!configName || !innerProps.options) return null;

  const handleChange = (key: string, value: IntegrationOptionsValueType) => {
    setModuleProperties((prev) => {
      const copyOfPrev: any = { ...prev };
      copyOfPrev[key] = value;
      return copyOfPrev;
    });
  };

  const getMutliselectData = (option: string) => {
    const currentWidgetDefinition = Widgets[innerProps.widgetId as keyof typeof Widgets];
    if (!Widgets) return [];

    const options = currentWidgetDefinition.options as any;
    return options[option]?.data ?? [];
  };

  const handleSave = () => {
    updateConfig(
      configName,
      (prev) => {
        const currentWidget = prev.widgets.find((x) => x.id === innerProps.widgetId);
        currentWidget!.properties = moduleProperties;

        return {
          ...prev,
          widgets: [...prev.widgets.filter((x) => x.id !== innerProps.widgetId), currentWidget!],
        };
      },
      true
    );
    context.closeModal(id);
  };

  return (
    <Stack>
      {items.map(([key, value]) => {
        const option = (currentWidgetDefinition as any).options[key] as IWidgetOptionValue;
        switch (option.type) {
          case 'switch':
            return (
              <Switch
                label={t(`descriptor.settings.${key}.label`)}
                checked={value as boolean}
                onChange={(ev) => handleChange(key, ev.currentTarget.checked)}
              />
            );
          case 'text':
            return (
              <TextInput
                label={t(`descriptor.settings.${key}.label`)}
                value={value as string}
                onChange={(ev) => handleChange(key, ev.currentTarget.value)}
              />
            );
          case 'multi-select':
            return (
              <MultiSelect
                data={getMutliselectData(key)}
                label={t(`descriptor.settings.${key}.label`)}
                value={value as string[]}
                onChange={(v) => handleChange(key, v)}
              />
            );
          default:
            return null;
        }
      })}
      <Group position="right">
        <Button onClick={() => context.closeModal(id)} variant="light">
          {t('common:cancel')}
        </Button>
        <Button onClick={handleSave}>{t('common:save')}</Button>
      </Group>
    </Stack>
  );
};

//     <Stack>
//       {items.map(([key, value]) => (
//         <>
//           {typeof value === 'boolean' ? (
//             <Switch
//               label={t(`descriptor.settings.${key}.label`)}
//               checked={value}
//               onChange={(ev) => handleChange(key, ev.currentTarget.checked)}
//             />
//           ) : null}
//           {typeof value === 'string' ? (
//             <TextInput
//               label={t(`descriptor.settings.${key}.label`)}
//               value={value}
//               onChange={(ev) => handleChange(key, ev.currentTarget.value)}
//             />
//           ) : null}
//           {typeof value === 'object' && Array.isArray(value) ? (
// <MultiSelect
//   data={getMutliselectData(key)}
//   label={t(`descriptor.settings.${key}.label`)}
//   value={value}
//   onChange={(v) => handleChange(key, v)}
// />
//           ) : null}
//         </>
//       ))}

//       <Group position="right">
//         <Button onClick={() => context.closeModal(id)} variant="light">
//           {t('common:cancel')}
//         </Button>
//         <Button onClick={handleSave}>{t('common:save')}</Button>
//       </Group>
//     </Stack>
//   );
// };