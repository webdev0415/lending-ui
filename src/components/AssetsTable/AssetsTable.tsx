import React from "react";
import { formatAmount } from "../../helpers";
import BodyText from "../BodyText/BodyText";
import { BodyWrapper } from "../BodyWrapper";
import { IconLoader } from "../IconLoader";

import "./assets-table.scss";

type TAsset = {
  icon: string;
  title: string;
  price: number;
  volume: number;
  supplyApy: number;
  borrowApy: number;
};

interface AssetsTableProps {
  assets: TAsset[];
}

const AssetsTable = (props: AssetsTableProps) => {
  return (
    <BodyWrapper>
      <table className="assets-table">
        <thead>
          <tr>
            <th>
              <BodyText>Asset</BodyText>
            </th>
            <th>
              <BodyText>Total Volume</BodyText>
            </th>
            <th>
              <BodyText>Supply APY</BodyText>
            </th>
            <th>
              <BodyText>Borrow APY</BodyText>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.assets.map((item: TAsset) => (
            <tr key={item.icon}>
              <td className="asset-table-column">
                <div className="asset-table-column-flex">
                  <IconLoader icon={item.icon} />
                  <div className="assets-table-asset">
                    <BodyText className="white-text">{item.title}</BodyText>
                    <BodyText light>{`$${item.price}`}</BodyText>
                  </div>
                </div>
              </td>
              <td className="asset-table-column">
                <BodyText light>{`$ ${formatAmount(
                  item.volume,
                  3,
                  ","
                )}`}</BodyText>
              </td>
              <td className="asset-table-column">
                <BodyText light>{`${item.supplyApy}%`}</BodyText>
              </td>
              <td className="asset-table-column">
                <BodyText light>{`${item.borrowApy}%`}</BodyText>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </BodyWrapper>
  );
};

export default AssetsTable;
