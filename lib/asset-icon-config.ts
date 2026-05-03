import {
  Laptop,
  Monitor,
  Smartphone,
  Mouse,
  Keyboard,
  Printer,
  Server,
  Table,
  Chair,
  Package,
  Car,
  Coffee,
  Tv,
  AirVent,
  Cpu,
  Wifi,
  Box
} from 'lucide-react-native';

export const getAssetIcon = (name: string, type?: string) => {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes('macbook') || lowercaseName.includes('laptop')) {
    return { icon: Laptop, color: '#3b82f6' }; // blue-500
  }
  if (lowercaseName.includes('monitor') || lowercaseName.includes('screen') || lowercaseName.includes('màn hình')) {
    return { icon: Monitor, color: '#8b5cf6' }; // violet-500
  }
  if (lowercaseName.includes('phone') || lowercaseName.includes('iphone') || lowercaseName.includes('điện thoại')) {
    return { icon: Smartphone, color: '#10b981' }; // emerald-500
  }
  if (lowercaseName.includes('mouse') || lowercaseName.includes('chuột')) {
    return { icon: Mouse, color: '#6b7280' }; // gray-500
  }
  if (lowercaseName.includes('keyboard') || lowercaseName.includes('bàn phím')) {
    return { icon: Keyboard, color: '#6b7280' }; // gray-500
  }
  if (lowercaseName.includes('print') || lowercaseName.includes('máy in')) {
    return { icon: Printer, color: '#f59e0b' }; // amber-500
  }
  if (lowercaseName.includes('server') || lowercaseName.includes('máy chủ')) {
    return { icon: Server, color: '#ef4444' }; // red-500
  }
  if (lowercaseName.includes('table') || lowercaseName.includes('desk') || lowercaseName.includes('bàn')) {
    return { icon: Table, color: '#d97706' }; // amber-600
  }
  if (lowercaseName.includes('chair') || lowercaseName.includes('ghế')) {
    return { icon: Chair, color: '#d97706' }; // amber-600
  }
  if (lowercaseName.includes('car') || lowercaseName.includes('xe')) {
    return { icon: Car, color: '#6366f1' }; // indigo-500
  }
  if (lowercaseName.includes('coffee') || lowercaseName.includes('cà phê')) {
    return { icon: Coffee, color: '#78350f' }; // amber-900
  }
  if (lowercaseName.includes('tv') || lowercaseName.includes('tivi') || lowercaseName.includes('television')) {
    return { icon: Tv, color: '#8b5cf6' }; // violet-500
  }
  if (lowercaseName.includes('air') || lowercaseName.includes('điều hòa') || lowercaseName.includes('máy lạnh')) {
    return { icon: AirVent, color: '#06b6d4' }; // cyan-500
  }
  if (lowercaseName.includes('cpu') || lowercaseName.includes('pc')) {
    return { icon: Cpu, color: '#3b82f6' }; // blue-500
  }
  if (lowercaseName.includes('wifi') || lowercaseName.includes('router') || lowercaseName.includes('network') || lowercaseName.includes('mạng')) {
    return { icon: Wifi, color: '#10b981' }; // emerald-500
  }

  // Fallbacks based on type
  if (type === 'Device' || type === 'IT') return { icon: Cpu, color: '#64748b' };
  if (type === 'Furniture') return { icon: Table, color: '#b45309' };
  if (type === 'Appliance') return { icon: Coffee, color: '#0f766e' };
  if (type === 'Facility') return { icon: Box, color: '#475569' };

  return { icon: Package, color: '#94a3b8' }; // slate-400
};
