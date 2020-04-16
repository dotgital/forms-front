
export interface Option {
  id: string;
  name: string;
}

export interface OptionGroup {
  name: string;
  banks: Option[];
}


/** list of banks */
export const BANKS: Option[] = [
  {name: 'Option A (Switzerland)', id: 'A'},
  {name: 'Option B (Switzerland)', id: 'B'},
  {name: 'Option C (France)', id: 'C'},
  {name: 'Option D (France)', id: 'D'},
  {name: 'Option E (France)', id: 'E'},
  {name: 'Option F (Italy)', id: 'F'},
  {name: 'Option G (Italy)', id: 'G'},
  {name: 'Option H (Italy)', id: 'H'},
  {name: 'Option I (Italy)', id: 'I'},
  {name: 'Option J (Italy)', id: 'J'},
  {name: 'Option Kolombia (United States of America)', id: 'K'},
  {name: 'Option L (Germany)', id: 'L'},
  {name: 'Option M (Germany)', id: 'M'},
  {name: 'Option N (Germany)', id: 'N'},
  {name: 'Option O (Germany)', id: 'O'},
  {name: 'Option P (Germany)', id: 'P'},
  {name: 'Option Q (Germany)', id: 'Q'},
  {name: 'Option R (Germany)', id: 'R'}
];

/** list of bank groups */
export const BANKGROUPS: OptionGroup[] = [
  {
    name: 'Switzerland',
    banks: [
      {name: 'Option A', id: 'A'},
      {name: 'Option B', id: 'B'}
    ]
  },
  {
    name: 'France',
    banks: [
      {name: 'Option C', id: 'C'},
      {name: 'Option D', id: 'D'},
      {name: 'Option E', id: 'E'},
    ]
  },
  {
    name: 'Italy',
    banks: [
      {name: 'Option F', id: 'F'},
      {name: 'Option G', id: 'G'},
      {name: 'Option H', id: 'H'},
      {name: 'Option I', id: 'I'},
      {name: 'Option J', id: 'J'},
    ]
  },
  {
    name: 'United States of America',
    banks: [
      {name: 'Option Kolombia', id: 'K'},
    ]
  },
  {
    name: 'Germany',
    banks: [
      {name: 'Option L', id: 'L'},
      {name: 'Option M', id: 'M'},
      {name: 'Option N', id: 'N'},
      {name: 'Option O', id: 'O'},
      {name: 'Option P', id: 'P'},
      {name: 'Option Q', id: 'Q'},
      {name: 'Option R', id: 'R'}
    ]
  }
];
