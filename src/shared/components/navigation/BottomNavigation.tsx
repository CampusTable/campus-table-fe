'use client';

import {
  GyebapDisableIcon,
  GyebapEnableIcon,
  HakgwanDisableIcon,
  HakgwanEnableIcon,
  HomeDisableIcon,
  HomeEnableIcon,
  JingwanDisableIcon,
  JingwanEnableIcon,
  MyDisableIcon,
  MyEnableIcon
} from "@/assets/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNavigation.module.css"
import { ComponentType, SVGProps } from "react";

interface Item {
  key: string;
  href: string;
  label: string;
  active: boolean;
  EnabledIcon: ComponentType<SVGProps<SVGSVGElement>>;
  DisabledIcon: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function BottomNavigation() {

  const pathname: string = usePathname();

  const isHome: boolean = pathname === '/';
  const isHakgwan: boolean = pathname.startsWith("/hakgwan");
  const isJingwan: boolean = pathname.startsWith("/jingwan");
  const isGyebop: boolean = pathname.startsWith("/gyebop");
  const isMy: boolean = pathname.startsWith("/my");

  const items: Item[] = [
    {
      key: "home",
      href: "/",
      label: "홈",
      active: isHome,
      EnabledIcon: HomeEnableIcon,
      DisabledIcon: HomeDisableIcon
    },
    {
      key: "hakgwan",
      href: "/hakgwan",
      label: "학생회관",
      active: isHakgwan,
      EnabledIcon: HakgwanEnableIcon,
      DisabledIcon: HakgwanDisableIcon
    },
    {
      key: "jingwan",
      href: "/jingwan",
      label: "진관홀",
      active: isJingwan,
      EnabledIcon: JingwanEnableIcon,
      DisabledIcon: JingwanDisableIcon
    },
    {
      key: "gyebop",
      href: "/gyebop",
      label: "계절밥상",
      active: isGyebop,
      EnabledIcon: GyebapEnableIcon,
      DisabledIcon: GyebapDisableIcon
    },
    {
      key: "my",
      href: "/my",
      label: "마이",
      active: isMy,
      EnabledIcon: MyEnableIcon,
      DisabledIcon: MyDisableIcon
    },
  ]

  return (
    <nav className={styles.navigation}>

      <div className={styles.container}>

        {items.map((item: Item) => {
          const Icon = item.active ? item.EnabledIcon : item.DisabledIcon;
          const labelClassName: string = item.active
            ? `${styles.label} ${styles.labelActive}`
            : `${styles.label}`;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={styles.item}
              replace
            >
              <Icon />
              <div className={labelClassName}>
                {item.label}
              </div>
            </Link>
          );
        })}

      </div>

    </nav>
  );
}