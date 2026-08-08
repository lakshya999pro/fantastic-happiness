import React, { useState } from 'react';
import { KidsAvatar, SmileyAvatar } from './Avatar';
import {
  ArrowLeft,
  ChevronRight,
  CloseIcon,
  GamepadIcon,
  GearIcon,
  HelpIcon,
  LockClosed,
  PencilIcon,
  PlusIcon,
  QualityIcon,
  RestrictIcon,
  SignOutIcon,
  SignalIcon,
  StorageIcon,
  SubtitleAppearanceIcon,
  TranslateIcon,
  UserIcon,
  WifiIcon,
  BellIcon
} from './Icons';

/* ---------------- shared bits ---------------- */

export const ScreenHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex items-center gap-5 px-4 pb-4 pt-3">
    <button onClick={onBack} aria-label="Back">
      <ArrowLeft className="h-7 w-7" />
    </button>
    <h1 className="text-[26px] font-bold tracking-[-0.02em]">{title}</h1>
  </div>
);

const Row: React.FC<{
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, title, subtitle, right, onClick, danger }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-4 bg-[#1c1c1c] px-4 py-[18px] text-left active:bg-[#262626]"
  >
    {icon && <span className={`flex-shrink-0 ${danger ? 'text-nfred' : 'text-white'}`}>{icon}</span>}
    <span className="min-w-0 flex-1">
      <span className={`block text-[19px] font-bold leading-tight ${danger ? 'text-nfred' : 'text-white'}`}>
        {title}
      </span>
      {subtitle && <span className="mt-1 block text-[15px] leading-snug text-[#a5a5a5]">{subtitle}</span>}
    </span>
    {right ?? <ChevronRight className="h-6 w-6 flex-shrink-0 text-white/85" />}
  </button>
);

const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; label: string }> = ({
  on,
  onChange,
  label
}) => (
  <span
    role="switch"
    aria-checked={on}
    aria-label={label}
    tabIndex={0}
    onClick={e => {
      e.stopPropagation();
      onChange(!on);
    }}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') onChange(!on);
    }}
    className={`relative inline-flex h-[30px] w-[54px] flex-shrink-0 cursor-pointer items-center rounded-full transition-colors ${
      on ? 'bg-[#0a84ff]' : 'bg-[#555]'
    }`}
  >
    <span
      className={`absolute h-[26px] w-[26px] rounded-full bg-white shadow transition-all ${
        on ? 'left-[26px]' : 'left-[2px]'
      }`}
    />
  </span>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="px-4 pb-3 pt-8 text-[21px] font-bold tracking-[-0.01em]">{children}</h2>
);

/* ---------------- profile bottom sheet ---------------- */

export const ProfileSheet: React.FC<{
  name: string;
  onClose: () => void;
  onEditProfile: () => void;
  onAppSettings: () => void;
  onAccount: () => void;
  onHelp: () => void;
  onSignOut: () => void;
}> = ({ name, onClose, onEditProfile, onAppSettings, onAccount, onHelp, onSignOut }) => (
  <div className="fixed inset-0 z-[95] mx-auto max-w-md" role="dialog" aria-label="Profile">
    <div className="absolute inset-0 bg-black/70" onClick={onClose} />
    <div className="no-scrollbar absolute inset-x-0 bottom-0 top-6 overflow-y-auto rounded-t-2xl bg-[#141414] px-3 pb-10 pt-3 animate-slide-up">
      <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#5a5a5a]" />
      <div className="relative mb-4 flex items-center justify-center">
        <h1 className="text-[30px] font-bold tracking-[-0.02em]">Profile</h1>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#2f2f2f]"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mb-6 rounded-2xl bg-[#1f1f1f] px-4 py-6 text-center">
        <SmileyAvatar className="mx-auto h-[118px] w-[118px]" radius={16} />
        <p className="mt-3 text-[20px] font-bold">{name}</p>
        <button onClick={onEditProfile} aria-label="Edit profile" className="absolute right-5 top-1/2 -translate-y-1/2">
          <PencilIcon className="h-7 w-7" />
        </button>
      </div>

      <div className="mb-8 flex justify-center gap-5">
        <div className="flex flex-col items-center gap-2">
          <KidsAvatar className="h-[86px] w-[86px]" radius={14} />
          <span className="text-[15px] font-bold">Children</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-[86px] w-[86px] items-center justify-center rounded-[14px] bg-[#2b2b2b]">
            <PlusIcon className="h-9 w-9" />
          </div>
          <span className="text-[15px] font-bold">Add</span>
        </div>
      </div>

      <div className="mb-9 flex justify-center">
        <button className="rounded-full bg-[#2b2b2b] px-9 py-[14px] text-[19px] font-bold active:opacity-80">
          Manage Profiles
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-lg">
          <Row icon={<GearIcon className="h-7 w-7" />} title="App Settings" onClick={onAppSettings} />
        </div>
        <div className="overflow-hidden rounded-lg">
          <Row icon={<UserIcon className="h-7 w-7" />} title="Account" onClick={onAccount} />
        </div>
        <div className="overflow-hidden rounded-lg">
          <Row icon={<HelpIcon className="h-7 w-7" />} title="Help" onClick={onHelp} />
        </div>
        <div className="overflow-hidden rounded-lg">
          <Row icon={<SignOutIcon className="h-7 w-7" />} title="Sign Out" onClick={onSignOut} danger />
        </div>
      </div>
    </div>
  </div>
);

/* ---------------- app settings ---------------- */

export const AppSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [notifications, setNotifications] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(true);

  return (
    <div className="fixed inset-0 z-[96] mx-auto max-w-md overflow-y-auto bg-black pb-16">
      <ScreenHeader title="App Settings" onBack={onBack} />

      <SectionLabel>Video Playback</SectionLabel>
      <Row
        icon={<SignalIcon className="h-7 w-7" />}
        title="Mobile Data Usage"
        subtitle="Automatic"
        right={<span />}
      />

      <SectionLabel>Notifications</SectionLabel>
      <Row
        icon={<BellIcon className="h-7 w-7" />}
        title="Allow notifications"
        subtitle="Customise in Settings → Notifications"
        right={<Toggle on={notifications} onChange={setNotifications} label="Allow notifications" />}
      />

      <SectionLabel>Downloads</SectionLabel>
      <div className="divide-y divide-white/10">
        <Row
          icon={<WifiIcon className="h-7 w-7" />}
          title="Wi-Fi Only"
          right={<Toggle on={wifiOnly} onChange={setWifiOnly} label="Wi-Fi only downloads" />}
        />
        <Row
          icon={<QualityIcon className="h-7 w-7" />}
          title="Download Video Quality"
          subtitle="Standard"
          right={<span />}
        />
        <Row
          icon={<StorageIcon className="h-7 w-7" />}
          title="Download Location"
          subtitle="Internal Storage"
          right={<span />}
        />
      </div>

      <div className="bg-[#1c1c1c] px-4 pb-6 pt-4">
        <div className="mb-2 flex items-center justify-between text-[15px]">
          <span className="text-[#c9c9c9]">Internal Storage</span>
          <span className="text-[#c9c9c9]">Default</span>
        </div>
        <div className="flex h-4 w-full overflow-hidden rounded-[2px] bg-[#5a5a5a]">
          <div className="h-full bg-white" style={{ width: '79%' }} />
          <div className="h-full bg-[#0a84ff]" style={{ width: '1%' }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-[14px]">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-white" /> Used • 193 GB
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-[#0a84ff]" /> Netflix • 21 B
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-[#8a8a8a]" /> Free • 50 GB
          </span>
        </div>
      </div>
    </div>
  );
};

/* ---------------- edit profile ---------------- */

export const EditProfile: React.FC<{ name: string; onName: (v: string) => void; onBack: () => void }> = ({
  name,
  onName,
  onBack
}) => (
  <div className="fixed inset-0 z-[97] mx-auto max-w-md overflow-y-auto bg-black pb-16">
    <ScreenHeader title="Edit Profile" onBack={onBack} />

    <div className="flex flex-col items-center pb-6 pt-2">
      <div className="relative">
        <SmileyAvatar className="h-[118px] w-[118px]" radius={8} />
        <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded bg-[#e6e6e6] text-black">
          <PencilIcon className="h-5 w-5" />
        </span>
      </div>
      <input
        value={name}
        onChange={e => onName(e.target.value)}
        aria-label="Profile name"
        className="mt-7 w-[68%] rounded bg-[#2b2b2b] px-4 py-[18px] text-[20px] outline-none focus:ring-2 focus:ring-white/40"
      />
    </div>

    <div className="flex flex-col gap-3 px-3">
      {[
        { icon: <GamepadIcon className="h-7 w-7" />, title: 'Game Handle', subtitle: 'Create your game handle' },
        { icon: <RestrictIcon className="h-7 w-7" />, title: 'Viewing Restrictions', subtitle: 'No restrictions' },
        { icon: <LockClosed className="h-7 w-7" />, title: 'Profile lock', subtitle: 'Add a 4-digit PIN to this profile' },
        {
          icon: <TranslateIcon className="h-7 w-7" />,
          title: 'Display Language',
          subtitle: 'Change the language of the text you see on Netflix across all devices.'
        },
        {
          icon: <SubtitleAppearanceIcon className="h-7 w-7" />,
          title: 'Audio & Subtitle Languages',
          subtitle: 'Choose the languages you like to watch shows and movies in.'
        },
        {
          icon: <SubtitleAppearanceIcon className="h-7 w-7" />,
          title: 'Subtitle Appearance',
          subtitle: 'Change the way subtitles appear on phones and tablets.'
        }
      ].map(r => (
        <div key={r.title} className="overflow-hidden rounded-lg">
          <Row icon={r.icon} title={r.title} subtitle={r.subtitle} />
        </div>
      ))}
    </div>
  </div>
);

/* ---------------- simple placeholder screens ---------------- */

export const SimpleScreen: React.FC<{
  title: string;
  message: string;
  onBack: () => void;
  children?: React.ReactNode;
}> = ({ title, message, onBack, children }) => (
  <div className="fixed inset-0 z-[96] mx-auto max-w-md overflow-y-auto bg-black pb-16">
    <ScreenHeader title={title} onBack={onBack} />
    <p className="px-4 pt-10 text-center text-[16px] leading-relaxed text-[#a5a5a5]">{message}</p>
    {children}
  </div>
);
