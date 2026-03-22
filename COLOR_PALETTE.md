# BOCRA Color Palette

## Service Area Colors (Primary)

| Color | Hex Code | Service Area | Usage |
|-------|----------|--------------|-------|
| 🔴 Pink/Magenta | `#AF2F54` | **Postal** | Postal & Mail Services |
| 💛 Golden Yellow | `#EFC812` | **Internet** | Internet & Domain Services |
| 🔵 Cyan/Blue | `#30B6CF` | **Telecommunication** | Telecom & Spectrum Services |
| 🟢 Green | `#2D6A2D` | **Broadcasting** | Broadcasting & Media Services |

## Tailwind Color Classes

```css
/* Postal Services */
from-bocra-postal / to-bocra-postal / text-bocra-postal / bg-bocra-postal

/* Internet Services */
from-bocra-internet / to-bocra-internet / text-bocra-internet / bg-bocra-internet

/* Telecommunication */
from-bocra-telecom / to-bocra-telecom / text-bocra-telecom / bg-bocra-telecom

/* Broadcasting */
from-bocra-broadcast / to-bocra-broadcast / text-bocra-broadcast / bg-bocra-broadcast
```

## Page Color Assignments

| Page | Service Area | Color | Tailwind Classes |
|------|--------------|-------|------------------|
| **About BOCRA** | General/All Services | Telecom (Primary) | `from-bocra-telecom to-bocra-broadcast` |
| **Services** | Multi-service showcase | All 4 Colors | Gradient or Card highlights |
| **Licensing** | Telecommunication | Telecom | `from-bocra-telecom` |
| **Complaints** | Support/General | Postal | `from-bocra-postal` |
| **Domain Registry** | Internet Service | Internet | `from-bocra-internet` |
| **News** | General | Telecom | `from-bocra-telecom` |
| **Publications** | Broadcasting | Broadcasting | `from-bocra-broadcast` |
| **Contact** | Support | Postal | `from-bocra-postal` |

## CSS Variables

```css
--bocra-postal: #AF2F54;
--bocra-internet: #EFC812;
--bocra-telecom: #30B6CF;
--bocra-broadcast: #2D6A2D;
```

## Design Guidelines

- Use service area colors for primary navigation and hero sections
- Use complementary color gradients for visual interest
- Maintain black text on all colored backgrounds for accessibility
- Apply consistent color coding across the platform for brand recognition
