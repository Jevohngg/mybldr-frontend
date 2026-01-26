export interface HOARequirement {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const hoaRequirements: HOARequirement[] = [
  // Exterior Colors & Materials
  {
    id: '1',
    category: 'Exterior Colors',
    title: 'Exterior Paint Colors',
    description: 'All exterior paint colors must be selected from the approved community color palette. Submit color selections to ARC for approval prior to application.',
  },
  {
    id: '2',
    category: 'Exterior Colors',
    title: 'Roof Materials',
    description: '30-year architectural shingles required. Colors limited to Charcoal, Weathered Wood, or Slate Gray. No metal or tile roofing permitted.',
  },
  {
    id: '3',
    category: 'Exterior Colors',
    title: 'Siding Materials',
    description: 'Hardie fiber cement siding or approved stucco finish required. Vinyl siding prohibited. Natural wood accents permitted with ARC approval.',
  },

  // Fencing
  {
    id: '4',
    category: 'Fencing',
    title: 'Fence Height',
    description: 'Maximum fence height of 6 feet for rear and side yards. Front yard fencing limited to 4 feet. No fence permitted forward of front building line.',
  },
  {
    id: '5',
    category: 'Fencing',
    title: 'Fence Materials',
    description: 'Wood privacy fence (cedar or pressure-treated pine) or wrought iron style aluminum. Chain link, vinyl, and barbed wire prohibited.',
  },
  {
    id: '6',
    category: 'Fencing',
    title: 'Fence Color',
    description: 'Natural wood stain or paint in earth tones (brown, tan, gray). White fencing permitted only for decorative front yard sections.',
  },

  // Landscaping
  {
    id: '7',
    category: 'Landscaping',
    title: 'Front Yard Landscaping',
    description: 'Minimum 2 trees (1 shade, 1 ornamental) and 15 shrubs required in front yard. Sod required for all visible lawn areas within 60 days of CO.',
  },
  {
    id: '8',
    category: 'Landscaping',
    title: 'Irrigation Requirements',
    description: 'Automatic irrigation system required for front yard and side yards visible from street. Smart controller with rain sensor mandatory.',
  },
  {
    id: '9',
    category: 'Landscaping',
    title: 'Tree Preservation',
    description: 'Trees with trunk diameter greater than 6 inches require ARC approval for removal. Replacement trees required at 2:1 ratio.',
  },
  {
    id: '10',
    category: 'Landscaping',
    title: 'Lawn Maintenance',
    description: 'Lawns must be mowed regularly and maintained weed-free. Maximum grass height of 6 inches. Dead plants must be replaced within 30 days.',
  },

  // Structures & Setbacks
  {
    id: '11',
    category: 'Structures',
    title: 'Accessory Structures',
    description: 'Sheds, playsets, and similar structures require ARC approval. Maximum height 10 feet. Must be located in rear yard only, minimum 5 feet from property line.',
  },
  {
    id: '12',
    category: 'Structures',
    title: 'Pools and Spas',
    description: 'In-ground pools permitted with ARC approval. Above-ground pools prohibited. Pool equipment must be screened from view. 4-foot safety fence required.',
  },
  {
    id: '13',
    category: 'Structures',
    title: 'Patio Covers',
    description: 'Patio covers and pergolas require ARC approval. Materials must match or complement home exterior. Maximum coverage 50% of rear yard.',
  },

  // Garage & Driveways
  {
    id: '14',
    category: 'Garage & Driveways',
    title: 'Garage Doors',
    description: 'Garage doors must remain closed when not in active use. Replacement doors require ARC approval. Colors must complement home exterior.',
  },
  {
    id: '15',
    category: 'Garage & Driveways',
    title: 'Driveway Materials',
    description: 'Concrete or approved pavers required. Asphalt driveways prohibited. Driveway extensions require ARC approval and must match existing material.',
  },
  {
    id: '16',
    category: 'Garage & Driveways',
    title: 'Vehicle Parking',
    description: 'Vehicles must be parked in garage or driveway. Street parking limited to 48 hours. Commercial vehicles, RVs, and boats prohibited from street view.',
  },

  // Mailboxes & Signage
  {
    id: '17',
    category: 'Mailboxes & Signage',
    title: 'Mailbox Standards',
    description: 'Community-standard mailbox required. Replacement must match approved design. Address numbers must be visible and match community standards.',
  },
  {
    id: '18',
    category: 'Mailboxes & Signage',
    title: 'Signage Restrictions',
    description: 'One real estate sign permitted during active listing (max 18"x24"). Political signs allowed 45 days before election. No commercial signage.',
  },

  // Lighting
  {
    id: '19',
    category: 'Lighting',
    title: 'Exterior Lighting',
    description: 'Exterior lighting must be warm white (2700K-3000K). Motion-sensor lights permitted. No colored lights except during holiday season (Nov 15 - Jan 15).',
  },
  {
    id: '20',
    category: 'Lighting',
    title: 'Landscape Lighting',
    description: 'Low-voltage landscape lighting permitted. Lights must be directed downward and shielded. Solar path lights allowed without ARC approval.',
  },

  // Maintenance
  {
    id: '21',
    category: 'Maintenance',
    title: 'Exterior Maintenance',
    description: 'Homes must be maintained in good repair. Peeling paint, damaged siding, and broken fixtures must be repaired within 30 days of notice.',
  },
  {
    id: '22',
    category: 'Maintenance',
    title: 'Trash & Recycling',
    description: 'Trash containers must be stored in garage or screened enclosure. Containers may be placed curbside no earlier than 6 PM day before pickup.',
  },
];
