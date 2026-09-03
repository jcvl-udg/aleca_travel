// lib/hotelbeds-types.ts

// 1. Estructura RAW real que devuelve Hotelbeds
export interface Activities {
    code:        string;
    name:        string;
    type:        string;
    country:     string;
    destination: string;
    modalities:  Modality[];
    paxRange:    PaxRange;
    suppliers:   Supplier[];
}

export interface Modality {
    code:      string;
    name:      string;
    onSale:    boolean;
    rates:     string[];
    languages: string[];
    sessions:  string[];
}

export interface PaxRange {
    min: number;
    max: number;
}

export interface Supplier {
    code: string;
    name: string;
} 