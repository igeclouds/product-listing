import { Card } from '@mantine/core';
import { RefObject } from 'react';
import { Tiles } from '../../Tiles/definition';
import { GridstackTileWrapper } from '../../Tiles/TileWrapper';
import { useGridstack } from '../gridstack/use-gridstack';

interface DashboardSidebarProps {
  location: 'right' | 'left';
}

export const DashboardSidebar = ({ location }: DashboardSidebarProps) => {
  const { refs, items, integrations } = useGridstack('sidebar', location);

  const minRow = useMinRowForFullHeight(refs.wrapper);

  return (
    <Card
      withBorder
      w={300}
      style={{
        background: 'none',
        borderStyle: 'dashed',
      }}
    >
      <div
        className="grid-stack grid-stack-sidebar"
        style={{ transitionDuration: '0s', height: '100%' }}
        data-sidebar={location}
        gs-min-row={minRow}
        ref={refs.wrapper}
      >
        {items.map((service) => {
          const { component: TileComponent, ...tile } = Tiles['service'];
          return (
            <GridstackTileWrapper
              id={service.id}
              type="service"
              key={service.id}
              itemRef={refs.items.current[service.id]}
              {...tile}
              {...service.shape.location}
              {...service.shape.size}
            >
              <TileComponent className="grid-stack-item-content" service={service} />
            </GridstackTileWrapper>
          );
        })}
        {Object.entries(integrations).map(([k, v]) => {
          const { component: TileComponent, ...tile } = Tiles[k as keyof typeof Tiles];

          return (
            <GridstackTileWrapper
              id={k}
              type="module"
              key={k}
              itemRef={refs.items.current[k]}
              {...tile}
              {...v.shape.location}
              {...v.shape.size}
            >
              <TileComponent className="grid-stack-item-content" module={v} />
            </GridstackTileWrapper>
          );
        })}
      </div>
    </Card>
  );
};

const useMinRowForFullHeight = (wrapperRef: RefObject<HTMLDivElement>) => {
  return wrapperRef.current ? Math.floor(wrapperRef.current!.offsetHeight / 64) : 2;
};