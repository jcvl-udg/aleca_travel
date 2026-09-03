// lib/mock-hotels.ts
import type { HotelbedsRawResponse } from "./hotelbeds-types";

export const MOCK_HOTELS: HotelbedsRawResponse = {
    "auditData": {
        "processTime": "195",
        "timestamp": "2018-11-16 10:10:34.629",
        "requestHost": "212.66.164.12",
        "serverId": "ip-10-185-90-99.eu-west-1.compute.internal.node.int-hbg-aws-eu-west-1.discovery",
        "environment": "[awseuwest1, awseuwest1b, ip_10_185_90_99]",
        "release": "80d6b02a41d538d94162b687b2f89cd1de509470",
        "token": "25D227D7AE4141099BFD15B1A780E672",
        "internal": "0|190891638A0C4F61542359434436|ES|07|4|82||||||||||||117||2~2~3~1|0|0||0|c8zj99aze7hdvtaqh4qvcck4|||"
    },
    "hotels": {
        "hotels": [
            {
                "code": 6930,
                "name": "Lindner Golf & Wellness Resort Portals Nous ",
                "categoryCode": "4LUX",
                "categoryName": "4 STARS LUXURY",
                "destinationCode": "PMI",
                "destinationName": "Majorca",
                "zoneCode": 51,
                "zoneName": "Portals Nous",
                "latitude": "39.5413728999968",
                "longitude": "2.5857849419117",
                "rooms": [
                    {
                        "code": "DBT.AS",
                        "name": "Double or Twin CLASSIC",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.AS|NRF-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007109b",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "155.00",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "155.00",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.AS|NRF-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007213a1",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "161.19",
                                "sellingRate": "179.10",
                                "hotelSellingRate": "179.10",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "17.91",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "179.10",
                                        "hotelAmount": "179.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.AS|CG-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007216ac",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "172.22",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "155.00",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.AS|CG-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000071ab3",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "179.10",
                                "sellingRate": "199.00",
                                "hotelSellingRate": "199.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "19.90",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "179.10",
                                        "hotelAmount": "179.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.AS|NRF-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007240d4",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "212.64",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "212.64",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.AS|NRF-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000071ddd",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "221.13",
                                "sellingRate": "245.70",
                                "hotelSellingRate": "245.70",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "24.57",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "245.70",
                                        "hotelAmount": "245.70",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.AS|CG-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000721aec",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "236.26",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "212.63",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.AS|CG-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007246f5",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "245.70",
                                "sellingRate": "273.00",
                                "hotelSellingRate": "273.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "27.30",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "245.70",
                                        "hotelAmount": "245.70",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    },
                    {
                        "code": "DBT.OM",
                        "name": "Double or Twin COMFORT",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.OM|NRF-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007225b2",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "178.37",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "178.37",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.OM|NRF-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007231b9",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "185.49",
                                "sellingRate": "206.10",
                                "hotelSellingRate": "206.10",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "20.61",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "206.10",
                                        "hotelAmount": "206.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.OM|CG-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007213c6",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "198.19",
                                "allotment": 11,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "178.37",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.OM|CG-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000071ace",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "206.10",
                                "sellingRate": "229.00",
                                "hotelSellingRate": "229.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "22.90",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "206.10",
                                        "hotelAmount": "206.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.OM|NRF-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000711ec",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "236.01",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "236.01",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.OM|NRF-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000722bf5",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "245.43",
                                "sellingRate": "272.70",
                                "hotelSellingRate": "272.70",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "27.27",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "272.70",
                                        "hotelAmount": "272.70",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.OM|CG-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007217106",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "262.23",
                                "allotment": 11,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "236.01",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.OM|CG-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007246110",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "272.70",
                                "sellingRate": "303.00",
                                "hotelSellingRate": "303.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "30.30",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "272.70",
                                        "hotelAmount": "272.70",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    },
                    {
                        "code": "DBT.VG",
                        "name": "Double or Twin GOLF VIEW",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|NRF-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000725fc1",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "193.95",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "193.95",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|NRF-MERCHANT1|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000725fc1",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "193.95",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "193.95",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|NRF-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007245c9",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "201.69",
                                "sellingRate": "224.10",
                                "hotelSellingRate": "224.10",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "22.41",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "224.10",
                                        "hotelAmount": "224.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|NRF-MERCHANT1|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES00000040000000007245c9",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "201.69",
                                "sellingRate": "224.10",
                                "hotelSellingRate": "224.10",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "22.41",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "224.10",
                                        "hotelAmount": "224.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|CG-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007232d7",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "215.50",
                                "allotment": 11,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "193.95",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|CG-MERCHANT1|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES00000040000000007232d7",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "215.50",
                                "allotment": 11,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "193.95",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|CG-MERCHANT1|BB||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000071ae0",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "224.10",
                                "sellingRate": "249.00",
                                "hotelSellingRate": "249.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "24.90",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "224.10",
                                        "hotelAmount": "224.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|CG-MERCHANT1|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000071ae0",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "224.10",
                                "sellingRate": "249.00",
                                "hotelSellingRate": "249.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "24.90",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "224.10",
                                        "hotelAmount": "224.10",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|NRF-MERCHANT1|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES00000040000000007212ed",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "237.18",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "237.18",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|NRF-MERCHANT1|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES00000040000000007241f6",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "246.65",
                                "sellingRate": "274.05",
                                "hotelSellingRate": "274.05",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "27.41",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "274.05",
                                        "hotelAmount": "274.05",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|NRF-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000723bfb",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "251.59",
                                "allotment": 11,
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "251.59",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|NRF-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000723f105",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "261.63",
                                "sellingRate": "290.70",
                                "hotelSellingRate": "290.70",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "29.07",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "rateCommentsId": "1|93108|0",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "290.70",
                                        "hotelAmount": "290.70",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|CG-MERCHANT1|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES00000040000000007235107",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "263.53",
                                "allotment": 11,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "237.18",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|CG-MERCHANT1|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000715112",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "274.05",
                                "sellingRate": "304.50",
                                "hotelSellingRate": "304.50",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "30.45",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "274.05",
                                        "hotelAmount": "274.05",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|6930|DBT.VG|CG-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007236117",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "279.54",
                                "allotment": 11,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "251.59",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|6930|DBT.VG|CG-MERCHANT1|HB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007246122",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "290.70",
                                "sellingRate": "323.00",
                                "hotelSellingRate": "323.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 11,
                                "commission": "32.30",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "290.70",
                                        "hotelAmount": "290.70",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-02-28T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    }
                ],
                "minRate": "155.00",
                "maxRate": "290.70",
                "currency": "EUR",
                "creditCards": [
                    {
                        "code": "VI",
                        "name": "VISA-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "AE",
                        "name": "AMEX-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "MA",
                        "name": "SWITCH-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "MC",
                        "name": "ECMC-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "DC",
                        "name": "DINERS-SSL",
                        "paymentType": "AT_HOTEL"
                    }
                ]
            },
            {
                "code": 1803,
                "name": "Roc Portonova",
                "categoryCode": "3LL",
                "categoryName": "3 KEYS",
                "destinationCode": "PMI",
                "destinationName": "Majorca",
                "zoneCode": 29,
                "zoneName": "Palmanova",
                "latitude": "39.525262",
                "longitude": "2.542101",
                "rooms": [
                    {
                        "code": "APT.B1-C4",
                        "name": "APARTMENT CAPACITY 4 ONE BEDROOM",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|1803|APT.B1-C4|CG-BAR SC|SC||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000721e32",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "50.30",
                                "allotment": 15,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "SC",
                                "boardName": "SELF CATERING",
                                "cancellationPolicies": [
                                    {
                                        "amount": "50.30",
                                        "from": "2019-03-12T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|1803|APT.B1-C4|CG-BAR SC|SC||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000721e32",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "50.30",
                                "allotment": 15,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "SC",
                                "boardName": "SELF CATERING",
                                "cancellationPolicies": [
                                    {
                                        "amount": "50.30",
                                        "from": "2019-03-12T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|1803|APT.B1-C4|CG-BAR SC|SC||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000721038",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "56.16",
                                "sellingRate": "62.40",
                                "hotelSellingRate": "62.40",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 15,
                                "commission": "6.24",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "SC",
                                "boardName": "SELF CATERING",
                                "cancellationPolicies": [
                                    {
                                        "amount": "62.40",
                                        "hotelAmount": "62.40",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-12T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|1803|APT.B1-C4|CG-BAR SC|SC||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000721038",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "56.16",
                                "sellingRate": "62.40",
                                "hotelSellingRate": "62.40",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 15,
                                "commission": "6.24",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "SC",
                                "boardName": "SELF CATERING",
                                "cancellationPolicies": [
                                    {
                                        "amount": "62.40",
                                        "hotelAmount": "62.40",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-12T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    },
                    {
                        "code": "APT.B2-C6",
                        "name": "APARTMENT TWO ROOMS 4 ADULTS + 2 CHILD",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|1803|APT.B2-C6|CG-BAR SC|SC||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000071739",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "57.07",
                                "allotment": 39,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "SC",
                                "boardName": "SELF CATERING",
                                "cancellationPolicies": [
                                    {
                                        "amount": "57.07",
                                        "from": "2019-03-12T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|1803|APT.B2-C6|CG-BAR SC|SC||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000072483f",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "63.72",
                                "sellingRate": "70.80",
                                "hotelSellingRate": "70.80",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 39,
                                "commission": "7.08",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "SC",
                                "boardName": "SELF CATERING",
                                "cancellationPolicies": [
                                    {
                                        "amount": "70.80",
                                        "hotelAmount": "70.80",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-12T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    }
                ],
                "minRate": "50.30",
                "maxRate": "63.72",
                "currency": "EUR",
                "creditCards": [
                    {
                        "code": "VI",
                        "name": "VISA-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "AE",
                        "name": "AMEX-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "MC",
                        "name": "ECMC-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "VE",
                        "name": "VISA-SSL",
                        "paymentType": "AT_HOTEL"
                    }
                ]
            },
            {
                "code": 3219,
                "name": "NH Ciutat de Mallorca",
                "categoryCode": "4EST",
                "categoryName": "4 STARS",
                "destinationCode": "PMI",
                "destinationName": "Majorca",
                "zoneCode": 10,
                "zoneName": "Palma",
                "latitude": "39.5558",
                "longitude": "2.62103",
                "rooms": [
                    {
                        "code": "DBL.ST",
                        "name": "DOUBLE STANDARD",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.ST|NRF-SDEALCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000724645",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "69.70",
                                "sellingRate": "77.44",
                                "hotelSellingRate": "77.44",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 45,
                                "commission": "7.74",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "77.44",
                                        "hotelAmount": "77.44",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.ST|NRF-SDEALCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000724645",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "69.70",
                                "sellingRate": "77.44",
                                "hotelSellingRate": "77.44",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 45,
                                "commission": "7.74",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "77.44",
                                        "hotelAmount": "77.44",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.ST|NRF-SDEALCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000724a46",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "70.74",
                                "allotment": 45,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "70.74",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.ST|NRF-SDEALCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000724a46",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "70.74",
                                "allotment": 45,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "70.74",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.ST|CG-BARCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000072144f",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "79.20",
                                "sellingRate": "88.00",
                                "hotelSellingRate": "88.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 45,
                                "commission": "8.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "88.00",
                                        "hotelAmount": "88.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.ST|CG-BARCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000072144f",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "79.20",
                                "sellingRate": "88.00",
                                "hotelSellingRate": "88.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 45,
                                "commission": "8.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "88.00",
                                        "hotelAmount": "88.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.ST|CG-FREEBBCOM15|BB||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000072144f",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "79.20",
                                "sellingRate": "88.00",
                                "hotelSellingRate": "88.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 45,
                                "commission": "8.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "88.00",
                                        "hotelAmount": "88.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.ST|CG-FREEBBCOM15|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000072144f",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "79.20",
                                "sellingRate": "88.00",
                                "hotelSellingRate": "88.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 45,
                                "commission": "8.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "88.00",
                                        "hotelAmount": "88.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.ST|CG-BARCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000722750",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "80.39",
                                "allotment": 45,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "80.39",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.ST|CG-BARCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000722750",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "80.39",
                                "allotment": 45,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "80.39",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.ST|CG-FREEBBCOM15|BB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000722750",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "80.39",
                                "allotment": 45,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "80.39",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.ST|CG-FREEBBCOM15|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000722750",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "80.39",
                                "allotment": 45,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "80.39",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    },
                    {
                        "code": "DBL.WV",
                        "name": "DOUBLE WITH VIEWS",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.WV|NRF-SDEALCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000072464e",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "78.70",
                                "sellingRate": "87.44",
                                "hotelSellingRate": "87.44",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "8.74",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "87.44",
                                        "hotelAmount": "87.44",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.WV|NRF-SDEALCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000072464e",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "78.70",
                                "sellingRate": "87.44",
                                "hotelSellingRate": "87.44",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "8.74",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "87.44",
                                        "hotelAmount": "87.44",
                                        "hotelCurrency": "EUR",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.WV|NRF-SDEALCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES000000400000000072584f",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "79.88",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "79.88",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0,
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.WV|NRF-SDEALCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000072584f",
                                "rateClass": "NRF",
                                "rateType": "BOOKABLE",
                                "net": "79.88",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "79.88",
                                        "from": "2018-11-15T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2",
                                "promotions": [
                                    {
                                        "code": "073",
                                        "name": "Non-refundable rate. No amendments permitted"
                                    }
                                ]
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.WV|CG-BARCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000721458",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "88.20",
                                "sellingRate": "98.00",
                                "hotelSellingRate": "98.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "9.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "98.00",
                                        "hotelAmount": "98.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.WV|CG-BARCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000721458",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "88.20",
                                "sellingRate": "98.00",
                                "hotelSellingRate": "98.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "9.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "98.00",
                                        "hotelAmount": "98.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.WV|CG-FREEBBCOM15|BB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000721458",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "88.20",
                                "sellingRate": "98.00",
                                "hotelSellingRate": "98.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "9.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "98.00",
                                        "hotelAmount": "98.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|H|1|3219|DBL.WV|CG-FREEBBCOM15|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000721458",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "88.20",
                                "sellingRate": "98.00",
                                "hotelSellingRate": "98.00",
                                "hotelCurrency": "EUR",
                                "hotelMandatory": true,
                                "allotment": 6,
                                "commission": "9.80",
                                "commissionVAT": "0.00",
                                "commissionPCT": "10.00",
                                "paymentType": "AT_HOTEL",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "98.00",
                                        "hotelAmount": "98.00",
                                        "hotelCurrency": "EUR",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.WV|CG-BARCOM15|RO||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000723559",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "89.53",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "89.53",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.WV|CG-BARCOM15|RO||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000723559",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "89.53",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "RO",
                                "boardName": "ROOM ONLY",
                                "cancellationPolicies": [
                                    {
                                        "amount": "89.53",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.WV|CG-FREEBBCOM15|BB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000723559",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "89.53",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "89.53",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|3219|DBL.WV|CG-FREEBBCOM15|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000723559",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "89.53",
                                "allotment": 6,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "89.53",
                                        "from": "2019-03-07T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    }
                ],
                "minRate": "69.70",
                "maxRate": "89.53",
                "currency": "EUR",
                "creditCards": [
                    {
                        "code": "VI",
                        "name": "VISA-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "AE",
                        "name": "AMEX-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "MC",
                        "name": "ECMC-SSL",
                        "paymentType": "AT_HOTEL"
                    },
                    {
                        "code": "DC",
                        "name": "DINERS-SSL",
                        "paymentType": "AT_HOTEL"
                    }
                ]
            },
            {
                "code": 69995,
                "name": "Be Live Collection Son Antem",
                "categoryCode": "5EST",
                "categoryName": "5 STARS",
                "destinationCode": "PMI",
                "destinationName": "Majorca",
                "zoneCode": 58,
                "zoneName": "Llucmajor",
                "latitude": "39.474675",
                "longitude": "2.827414",
                "rooms": [
                    {
                        "code": "DBT.C2-SU",
                        "name": "Double or Twin SUPERIOR SINGLE PARENT 1 CHILD",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.C2-SU|CG-TODOSBB|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000072226c",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "108.34",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "108.34",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.C2-SU|CG-TODOSHB|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000724788",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "136.71",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "136.71",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    },
                    {
                        "code": "DBT.GV-2",
                        "name": "Double or Twin SINGLE PARENT CHILD 1 SPANISH GARDEN VIEW",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.GV-2|CG-TODOSBB|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000724070",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "112.64",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "112.64",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.GV-2|CG-TODOSHB|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES00000040000000007118d",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "141.01",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "141.01",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    },
                    {
                        "code": "DBT.SU-2",
                        "name": "Double or Twin SINGLE PARENT CHILD 1 SPANISH FIELD GOLF VIEWS",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU-2|CG-TODOSBB|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000725e74",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "116.94",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "116.94",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU-2|CG-TODOSHB|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000722d90",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "144.45",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "144.45",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    },
                    {
                        "code": "DBT.VP-2",
                        "name": "Double or Twin SINGLE PARENT CHILD 1 SPANISH POOL VIEWS",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.VP-2|CG-TODOSBB|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000072357d",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "125.53",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "125.53",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.VP-2|CG-TODOSHB|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000071599",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "153.05",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "153.05",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    },
                    {
                        "code": "DBT.PI-2",
                        "name": "Double or Twin SINGLE PARENT 1 CHILD PRIORITY LOCATION",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.PI-2|CG-TODOSBB|BB||1~1~1|2|N@190891638A0C4F61542359434436AAES0000004000000000724582",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "130.69",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "130.69",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.PI-2|CG-TODOSHB|HB||1~1~1|2|N@190891638A0C4F61542359434436AAES000000400000000072159e",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "158.21",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "158.21",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 1,
                                "children": 1,
                                "childrenAges": "2"
                            }
                        ]
                    },
                    {
                        "code": "DBT.SU",
                        "name": "Double or Twin SUPERIOR",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU|CG-TODOSBB|BB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000722d90",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "144.45",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "144.45",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU|CG-TODOSHB|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000721cb6",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "182.28",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "182.28",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    },
                    {
                        "code": "DBT.GV-SU",
                        "name": "Double or Twin SUPERIOR GARDEN VIEW",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.GV-SU|CG-TODOSBB|BB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000722f96",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "150.47",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "150.47",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.GV-SU|CG-TODOSHB|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000722cbb",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "187.44",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "187.44",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    },
                    {
                        "code": "DBT.SU-1",
                        "name": "Double or Twin SUPERIOR VISTAS AL CAMPO DE GOLF",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU-1|CG-TODOSBB|BB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000723f9b",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "155.63",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "155.63",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU-1|CG-TODOSHB|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000723cc0",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "192.60",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "192.60",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    },
                    {
                        "code": "DBT.SU-VP",
                        "name": "Double or Twin SUPERIOR POOL VIEW",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU-VP|CG-TODOSBB|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007251a6",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "166.81",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "166.81",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.SU-VP|CG-TODOSHB|HB||1~2~0||N@190891638A0C4F61542359434436AAES0000004000000000724ecb",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "203.78",
                                "allotment": 20,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "203.78",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    },
                    {
                        "code": "DBT.PI-SU",
                        "name": "Double or Twin PRIORITY LOCATION",
                        "rates": [
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.PI-SU|CG-TODOSBB|BB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007244ad",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "173.68",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "BB",
                                "boardName": "BED AND BREAKFAST",
                                "cancellationPolicies": [
                                    {
                                        "amount": "173.68",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            },
                            {
                                "rateKey": "20190315|20190316|W|1|69995|DBT.PI-SU|CG-TODOSHB|HB||1~2~0||N@190891638A0C4F61542359434436AAES00000040000000007242d2",
                                "rateClass": "NOR",
                                "rateType": "BOOKABLE",
                                "net": "210.66",
                                "allotment": 10,
                                "paymentType": "AT_WEB",
                                "packaging": false,
                                "boardCode": "HB",
                                "boardName": "HALF BOARD",
                                "cancellationPolicies": [
                                    {
                                        "amount": "210.66",
                                        "from": "2019-03-13T23:59:00+01:00"
                                    }
                                ],
                                "rooms": 1,
                                "adults": 2,
                                "children": 0
                            }
                        ]
                    }
                ],
                "minRate": "108.34",
                "maxRate": "210.66",
                "currency": "EUR"
            }
        ],
        "checkIn": "2019-03-15",
        "total": 4,
        "checkOut": "2019-03-16"
    }
};