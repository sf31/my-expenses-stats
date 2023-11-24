import { Payment } from './app.types';

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'item100',
    date: 1672444800000,
    payee: 'Payee-100',
    expense: 80,
    income: 2000,
    category: 'Rent',
    subcategory: 'January Rent',
    notes: 'Paid January rent',
    paymentMethod: 'bank transfer',
  },

  {
    id: 'id1',
    date: 1675286400000,
    payee: 'John Doe',
    expense: 10,
    income: 100,
    category: 'Utilities',
    subcategory: 'Electricity',
    notes: 'January payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id2',
    date: 1675372800000,
    payee: 'John Doe',
    expense: 75,
    income: 100,
    category: 'Rent',
    subcategory: 'Apartment Rental',
    notes: 'January payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id3',
    date: 1675459200000,
    payee: 'Jane Doe',
    expense: 50,
    income: 150,
    category: 'Groceries',
    subcategory: 'Supermarket',
    notes: 'Weekly grocery shopping',
    paymentMethod: 'debit card',
  },
  {
    id: 'id4',
    date: 1675545600000,
    payee: 'Jane Doe',
    expense: 50,
    income: 200,
    category: 'Car',
    subcategory: 'Fuel',
    notes: 'Filled up petrol tank',
    paymentMethod: 'credit card',
  },
  {
    id: 'id5',
    date: 1675632000000,
    payee: 'Jane Doe',
    expense: 100,
    income: 500,
    category: 'Utilities',
    subcategory: 'Internet',
    notes: 'Monthly broadband bill',
    paymentMethod: 'bank transfer',
  },
  {
    id: 'id6',
    date: 1675718400000,
    payee: 'John Doe',
    expense: 300,
    income: 1500,
    category: 'Mortgage',
    subcategory: 'House',
    notes: 'Monthly mortgage payment',
    paymentMethod: 'bank transfer',
  },
  {
    id: 'id7',
    date: 1675804800000,
    payee: 'Jane Doe',
    expense: 150,
    income: 750,
    category: 'Children',
    subcategory: 'School Supplies',
    notes: 'Bought new school supplies',
    paymentMethod: 'credit card',
  },
  {
    id: 'id8',
    date: 1675891200000,
    payee: 'John Doe',
    expense: 10,
    income: 50,
    category: 'Personal',
    subcategory: 'Cinema',
    notes: 'Watched a movie',
    paymentMethod: 'debit card',
  },
  {
    id: 'id9',
    date: 1675977600000,
    payee: 'John Doe',
    expense: 200,
    income: 1000,
    category: 'Children',
    subcategory: 'School Fees',
    notes: 'Paid school fees',
    paymentMethod: 'bank transfer',
  },
  {
    id: 'id10',
    date: 1676064000000,
    payee: 'Jane Doe',
    expense: 40,
    income: 200,
    category: 'Personal',
    subcategory: 'Clothes',
    notes: 'Bought a new dress',
    paymentMethod: 'credit card',
  },
  {
    id: 'id11',
    date: 1676150400000,
    payee: 'John Doe',
    expense: 50,
    income: 250,
    category: 'Groceries',
    subcategory: 'Supermarket',
    notes: 'Weekly grocery shopping',
    paymentMethod: 'debit card',
  },
  {
    id: 'id12',
    date: 1676236800000,
    payee: 'Jane Doe',
    expense: 200,
    income: 1000,
    category: 'Rent',
    subcategory: 'Apartment Rental',
    notes: 'February rent payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id13',
    date: 1676323200000,
    payee: 'John Doe',
    expense: 30,
    income: 90,
    category: 'Car',
    subcategory: 'Services',
    notes: 'Car wash',
    paymentMethod: 'credit card',
  },
  {
    id: 'id14',
    date: 1676409600000,
    payee: 'Jane Doe',
    expense: 100,
    income: 500,
    category: 'Children',
    subcategory: 'Books',
    notes: 'Bought new books for school',
    paymentMethod: 'debit card',
  },
  {
    id: 'id15',
    date: 1676496000000,
    payee: 'John Doe',
    expense: 90,
    income: 450,
    category: 'Personal',
    subcategory: 'Gym',
    notes: 'Monthly gym payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id16',
    date: 1676582400000,
    payee: 'Jane Doe',
    expense: 70,
    income: 350,
    category: 'Utilities',
    subcategory: 'Electricity',
    notes: 'February electricity bill',
    paymentMethod: 'credit card',
  },
  {
    id: 'id17',
    date: 1676668800000,
    payee: 'John Doe',
    expense: 30,
    income: 90,
    category: 'Groceries',
    subcategory: 'Supermarket',
    notes: 'Weekly grocery shopping',
    paymentMethod: 'debit card',
  },
  {
    id: 'id18',
    date: 1676755200000,
    payee: 'Jane Doe',
    expense: 200,
    income: 1000,
    category: 'Rent',
    subcategory: 'Apartment Rental',
    notes: 'March rent payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id19',
    date: 1676841600000,
    payee: 'John Doe',
    expense: 30,
    income: 90,
    category: 'Car',
    subcategory: 'Services',
    notes: 'Car wash',
    paymentMethod: 'credit card',
  },
  {
    id: 'id20',
    date: 1676928000000,
    payee: 'Jane Doe',
    expense: 100,
    income: 500,
    category: 'Children',
    subcategory: 'Books',
    notes: 'Bought new books for school',
    paymentMethod: 'debit card',
  },
  {
    id: 'id21',
    date: 1677014400000,
    payee: 'John Doe',
    expense: 90,
    income: 450,
    category: 'Personal',
    subcategory: 'Gym',
    notes: 'Monthly gym payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id22',
    date: 1677100800000,
    payee: 'Jane Doe',
    expense: 70,
    income: 350,
    category: 'Utilities',
    subcategory: 'Electricity',
    notes: 'March electricity bill',
    paymentMethod: 'credit card',
  },
  {
    id: 'id23',
    date: 1677187200000,
    payee: 'John Doe',
    expense: 30,
    income: 90,
    category: 'Groceries',
    subcategory: 'Supermarket',
    notes: 'Weekly grocery shopping',
    paymentMethod: 'debit card',
  },
  {
    id: 'id24',
    date: 1677273600000,
    payee: 'Jane Doe',
    expense: 200,
    income: 1000,
    category: 'Rent',
    subcategory: 'Apartment Rental',
    notes: 'April rent payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id25',
    date: 1677360000000,
    payee: 'John Doe',
    expense: 30,
    income: 90,
    category: 'Car',
    subcategory: 'Services',
    notes: 'Car wash',
    paymentMethod: 'credit card',
  },
  {
    id: 'id26',
    date: 1677446400000,
    payee: 'Jane Doe',
    expense: 100,
    income: 500,
    category: 'Children',
    subcategory: 'Books',
    notes: 'Bought new books for school',
    paymentMethod: 'debit card',
  },
  {
    id: 'id27',
    date: 1677532800000,
    payee: 'John Doe',
    expense: 90,
    income: 450,
    category: 'Personal',
    subcategory: 'Gym',
    notes: 'Monthly gym payment',
    paymentMethod: 'credit card',
  },
  {
    id: 'id28',
    date: 1677619200000,
    payee: 'Jane Doe',
    expense: 70,
    income: 350,
    category: 'Utilities',
    subcategory: 'Electricity',
    notes: 'April electricity bill',
    paymentMethod: 'credit card',
  },
  {
    id: 'id29',
    date: 1677705600000,
    payee: 'John Doe',
    expense: 30,
    income: 90,
    category: 'Groceries',
    subcategory: 'Supermarket',
    notes: 'Weekly grocery shopping',
    paymentMethod: 'debit card',
  },
  {
    id: 'id30',
    date: 1677792000000,
    payee: 'Jane Doe',
    expense: 200,
    income: 1000,
    category: 'Rent',
    subcategory: 'Apartment Rental',
    notes: 'May rent payment',
    paymentMethod: 'credit card',
  },

  {
    id: 'id31',
    date: 1677878400000,
    payee: 'John Doe',
    expense: 40,
    income: 200,
    category: 'Entertainment',
    subcategory: 'Movies',
    notes: 'Movie ticket',
    paymentMethod: 'debit card',
  },
  {
    id: 'id32',
    date: 1677964800000,
    payee: 'Jane Doe',
    expense: 70,
    income: 350,
    category: 'Transport',
    subcategory: 'Gas',
    notes: 'Gas for car',
    paymentMethod: 'credit card',
  },
  {
    id: 'id33',
    date: 1678051200000,
    payee: 'John Doe',
    expense: 120,
    income: 600,
    category: 'Education',
    subcategory: 'Books',
    notes: 'New textbooks',
    paymentMethod: 'debit card',
  },
  {
    id: 'id34',
    date: 1678137600000,
    payee: 'Jane Doe',
    expense: 45,
    income: 225,
    category: 'Grocery',
    subcategory: 'Vegetables',
    notes: 'Bought vegetables',
    paymentMethod: 'credit card',
  },
  {
    id: 'id35',
    date: 1678224000000,
    payee: 'John Doe',
    expense: 100,
    income: 500,
    category: 'Health',
    subcategory: 'Medicine',
    notes: 'Bought medicine',
    paymentMethod: 'debit card',
  },
  {
    id: 'id36',
    date: 1678310400000,
    payee: 'Jane Doe',
    expense: 200,
    income: 1000,
    category: 'Rent',
    subcategory: 'House',
    notes: 'House rent for June',
    paymentMethod: 'debit card',
  },
  {
    id: 'id37',
    date: 1678396800000,
    payee: 'John Doe',
    expense: 50,
    income: 250,
    category: 'Utilities',
    subcategory: 'Internet',
    notes: 'Internet bill for June',
    paymentMethod: 'credit card',
  },
  {
    id: 'id38',
    date: 1678483200000,
    payee: 'Jane Doe',
    expense: 150,
    income: 750,
    category: 'Education',
    subcategory: 'Tuition Fees',
    notes: 'Paid tuition fees',
    paymentMethod: 'debit card',
  },
  {
    id: 'id39',
    date: 1678569600000,
    payee: 'John Doe',
    expense: 100,
    income: 500,
    category: 'Entertainment',
    subcategory: 'Concert',
    notes: 'Bought a concert ticket',
    paymentMethod: 'credit card',
  },
  {
    id: 'id40',
    date: 1678656000000,
    payee: 'Jane Doe',
    expense: 80,
    income: 400,
    category: 'Grocery',
    subcategory: 'Vegetables',
    notes: 'Bought vegetables',
    paymentMethod: 'credit card',
  },
  {
    id: 'id41',
    date: 1678742400000,
    payee: 'John Doe',
    expense: 100,
    income: 500,
    category: 'Health',
    subcategory: 'Medicine',
    notes: 'Bought medicine',
    paymentMethod: 'debit card',
  },
  {
    id: 'id42',
    date: 1678828800000,
    payee: 'Jane Doe',
    expense: 200,
    income: 1000,
    category: 'Rent',
    subcategory: 'House',
    notes: 'House rent for July',
    paymentMethod: 'debit card',
  },
  {
    id: 'id43',
    date: 1678915200000,
    payee: 'John Doe',
    expense: 50,
    income: 250,
    category: 'Utilities',
    subcategory: 'Internet',
    notes: 'Internet bill for July',
    paymentMethod: 'credit card',
  },
  {
    id: 'id44',
    date: 1679001600000,
    payee: 'Jane Doe',
    expense: 150,
    income: 750,
    category: 'Education',
    subcategory: 'Tuition Fees',
    notes: 'Paid tuition fees',
    paymentMethod: 'debit card',
  },
  {
    id: 'id45',
    date: 1679088000000,
    payee: 'John Doe',
    expense: 100,
    income: 500,
    category: 'Entertainment',
    subcategory: 'Concert',
    notes: 'Bought concert ticket',
    paymentMethod: 'credit card',
  },
  {
    id: 'id46',
    date: 1679174400000,
    payee: 'Jane Doe',
    expense: 80,
    income: 400,
    category: 'Grocery',
    subcategory: 'Fruits',
    notes: 'Bought fruits',
    paymentMethod: 'debit card',
  },
  {
    id: 'id47',
    date: 1679260800000,
    payee: 'John Doe',
    expense: 150,
    income: 750,
    category: 'Health',
    subcategory: 'Medicine',
    notes: 'Bought medicine',
    paymentMethod: 'credit card',
  },
  {
    id: 'id48',
    date: 1679347200000,
    payee: 'Jane Doe',
    expense: 50,
    income: 250,
    category: 'Transportation',
    subcategory: 'Gas',
    notes: 'Purchased gas for car',
    paymentMethod: 'debit card',
  },
  {
    id: 'id49',
    date: 1679433600000,
    payee: 'John Doe',
    expense: 200,
    income: 1000,
    category: 'Rent',
    subcategory: 'House',
    notes: 'House rent for August',
    paymentMethod: 'credit card',
  },
  {
    id: 'id50',
    date: 1679520000000,
    payee: 'Jane Doe',
    expense: 120,
    income: 600,
    category: 'Utilities',
    subcategory: 'Electric Bill',
    notes: 'Paid electric bill',
    paymentMethod: 'debit card',
  },

  {
    id: 'id51',
    date: 1679606400000,
    payee: 'John Doe',
    expense: 40,
    income: 200,
    category: 'Entertainment',
    subcategory: 'Movies',
    notes: 'Movie ticket',
    paymentMethod: 'debit card',
  },
  {
    id: 'id52',
    date: 1679692800000,
    payee: 'Jane Doe',
    expense: 220,
    income: 1100,
    category: 'Transport',
    subcategory: 'Gas',
    notes: 'Gas for car',
    paymentMethod: 'credit card',
  },
  {
    id: 'id53',
    date: 1679779200000,
    payee: 'John Doe',
    expense: 130,
    income: 650,
    category: 'Education',
    subcategory: 'Books',
    notes: 'New textbooks',
    paymentMethod: 'debit card',
  },
  {
    id: 'id54',
    date: 1679865600000,
    payee: 'Jane Doe',
    expense: 45,
    income: 225,
    category: 'Grocery',
    subcategory: 'Vegetables',
    notes: 'Bought vegetables',
    paymentMethod: 'credit card',
  },
  {
    id: 'id55',
    date: 1679952000000,
    payee: 'John Doe',
    expense: 120,
    income: 600,
    category: 'Health',
    subcategory: 'Medicine',
    notes: 'Bought medicine',
    paymentMethod: 'debit card',
  },
  {
    id: 'id56',
    date: 1680038400000,
    payee: 'Jane Doe',
    expense: 230,
    income: 1150,
    category: 'Rent',
    subcategory: 'House',
    notes: 'House rent for September',
    paymentMethod: 'debit card',
  },
  {
    id: 'id57',
    date: 1680124800000,
    payee: 'John Doe',
    expense: 60,
    income: 300,
    category: 'Utilities',
    subcategory: 'Internet',
    notes: 'Internet bill for August',
    paymentMethod: 'credit card',
  },
  {
    id: 'id58',
    date: 1680211200000,
    payee: 'Jane Doe',
    expense: 170,
    income: 850,
    category: 'Education',
    subcategory: 'Tuition Fees',
    notes: 'Paid tuition fees',
    paymentMethod: 'debit card',
  },
  {
    id: 'id59',
    date: 1680297600000,
    payee: 'John Doe',
    expense: 110,
    income: 550,
    category: 'Entertainment',
    subcategory: 'Concert',
    notes: 'Bought concert ticket',
    paymentMethod: 'credit card',
  },
  {
    id: 'id60',
    date: 1680384000000,
    payee: 'Jane Doe',
    expense: 80,
    income: 400,
    category: 'Grocery',
    subcategory: 'Fruits',
    notes: 'Bought fruits',
    paymentMethod: 'debit card',
  },
  {
    id: 'id61',
    date: 1680470400000,
    payee: 'John Doe',
    expense: 160,
    income: 800,
    category: 'Health',
    subcategory: 'Medicine',
    notes: 'Bought medicine',
    paymentMethod: 'credit card',
  },
  {
    id: 'id62',
    date: 1680556800000,
    payee: 'Jane Doe',
    expense: 50,
    income: 250,
    category: 'Transportation',
    subcategory: 'Gas',
    notes: 'Purchased gas for car',
    paymentMethod: 'debit card',
  },
  {
    id: 'id63',
    date: 1680643200000,
    payee: 'John Doe',
    expense: 210,
    income: 1050,
    category: 'Rent',
    subcategory: 'House',
    notes: 'House rent for October',
    paymentMethod: 'credit card',
  },
  {
    id: 'id64',
    date: 1680729600000,
    payee: 'Jane Doe',
    expense: 130,
    income: 650,
    category: 'Utilities',
    subcategory: 'Electric Bill',
    notes: 'Paid electric bill',
    paymentMethod: 'debit card',
  },
  {
    id: 'id65',
    date: 1680816000000,
    payee: 'John Doe',
    expense: 40,
    income: 200,
    category: 'Entertainment',
    subcategory: 'Movies',
    notes: 'Movie ticket',
    paymentMethod: 'credit card',
  },
  {
    id: 'id66',
    date: 1680902400000,
    payee: 'Jane Doe',
    expense: 250,
    income: 1250,
    category: 'Transport',
    subcategory: 'Gas',
    notes: 'Gas for car',
    paymentMethod: 'debit card',
  },
  {
    id: 'id67',
    date: 1680988800000,
    payee: 'John Doe',
    expense: 140,
    income: 700,
    category: 'Education',
    subcategory: 'Books',
    notes: 'New textbooks',
    paymentMethod: 'credit card',
  },
  {
    id: 'id68',
    date: 1681075200000,
    payee: 'Jane Doe',
    expense: 45,
    income: 225,
    category: 'Grocery',
    subcategory: 'Vegetables',
    notes: 'Bought vegetables',
    paymentMethod: 'debit card',
  },
  {
    id: 'id69',
    date: 1681161600000,
    payee: 'John Doe',
    expense: 130,
    income: 650,
    category: 'Health',
    subcategory: 'Medicine',
    notes: 'Bought medicine',
    paymentMethod: 'credit card',
  },
  {
    id: 'id70',
    date: 1681248000000,
    payee: 'Jane Doe',
    expense: 240,
    income: 1200,
    category: 'Rent',
    subcategory: 'House',
    notes: 'House rent for November',
    paymentMethod: 'debit card',
  },
];
