'use strict';

/* ============================================================
   Static game data — ported verbatim from ecoexample.js
   ============================================================ */

const infra_turns = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "14", "16", "19", "22", "26", "31", "37", "44", "52", "62", "74", "88", "105", "126", "151", "181", "217", "260", "312", "374", "448", "537", "644", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "750", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500", "2500"];

const planets_agriculture_mod = {
    Barren: -1, Icy: -1, Marshy: -0.5, Forest: 1, Oceanic: -0.5, Rocky: -1, Desert: -0.75, Balanced: 0, Gas: -1,
    Cluster_Lvl_1: 0.15, Cluster_Lvl_2: 0.3, Cluster_Lvl_3: 0.45,
    U_Rich: -1, U_Eden: -0.98, U_Spazial: -1, U_Large: -1, U_Fertile: 1.75, Dead: -1,
    Similare_C_1: -.7, Similare_C_2: -0.65, Similare_C_3: -0.6, Similare_C_4: -0.55, Similare_C_5: -0.52,
    Assimilated_C_1: -.1, Assimilated_C_2: 0, Assimilated_C_3: .1,
    Tainted_C_1: -0.2, Tainted_C_2: -0.25, Tainted_C_3: -0.3, Tainted_C_4: -0.35,
    Infected_C_1: -.1, Infected_C_2: 0, Infected_C_3: .1
};
const planets_mining_mod = {
    Barren: .5, Icy: -.95, Marshy: -0.5, Forest: -.25, Oceanic: -0.5, Rocky: -.90, Desert: 1, Balanced: 0, Gas: -1,
    Cluster_Lvl_1: 0.1, Cluster_Lvl_2: 0.2, Cluster_Lvl_3: 0.3,
    U_Rich: 1.5, U_Eden: -1, U_Spazial: -1, U_Large: -1, U_Fertile: -1, Dead: -1,
    Similare_C_1: -.5, Similare_C_2: -0.55, Similare_C_3: -0.6, Similare_C_4: -0.65, Similare_C_5: -0.70,
    Assimilated_C_1: 0, Assimilated_C_2: -.05, Assimilated_C_3: -.1,
    Tainted_C_1: -0.5, Tainted_C_2: -0.55, Tainted_C_3: -0.6, Tainted_C_4: -0.65,
    Infected_C_1: -.3, Infected_C_2: -.35, Infected_C_3: -.4
};
const planets_industry_mod = {
    Barren: .5, Icy: -.25, Marshy: -0.2, Forest: 0, Oceanic: -0.2, Rocky: -.2, Desert: -0.25, Balanced: 0, Gas: -.9,
    Cluster_Lvl_1: 0.1, Cluster_Lvl_2: 0.2, Cluster_Lvl_3: 0.3,
    U_Rich: -.9, U_Eden: .25, U_Spazial: -.9, U_Large: .75, U_Fertile: .25, Dead: -.95,
    Similare_C_1: -.7, Similare_C_2: -0.65, Similare_C_3: -0.6, Similare_C_4: -0.55, Similare_C_5: -0.52,
    Assimilated_C_1: -.2, Assimilated_C_2: -.1, Assimilated_C_3: 0,
    Tainted_C_1: -0.2, Tainted_C_2: -0.25, Tainted_C_3: -0.3, Tainted_C_4: -0.35,
    Infected_C_1: -.1, Infected_C_2: 0, Infected_C_3: .1
};
const planets_pop_mod = {
    Barren: -.5, Icy: -.25, Marshy: -0.2, Forest: -.1, Oceanic: -0.2, Rocky: -.25, Desert: -.25, Balanced: .2, Gas: 0,
    Cluster_Lvl_1: 0.1, Cluster_Lvl_2: 0.2, Cluster_Lvl_3: 0.3,
    U_Rich: -.9, U_Eden: 10, U_Spazial: -.9, U_Large: -.8, U_Fertile: -.5, Dead: -.95,
    Similare_C_1: .2, Similare_C_2: .2, Similare_C_3: .2, Similare_C_4: .2, Similare_C_5: .2,
    Assimilated_C_1: 0, Assimilated_C_2: -.05, Assimilated_C_3: -.1,
    Tainted_C_1: -0.2, Tainted_C_2: -0.3, Tainted_C_3: -0.4, Tainted_C_4: -0.5,
    Infected_C_1: -.3, Infected_C_2: -.35, Infected_C_3: -.4
};

const races = {
    0: { name: 'Terran', colonies: 15, tax: 0, agriculture: 0.20, commercial: .2, industry: 2.20, demand: 3.50, maintenance: 0, mineral: 0, plunder: -0.5 },
    1: { name: 'A.Miner', colonies: 12, tax: 2.20, agriculture: -0.50, commercial: -0.95, industry: 3.50, demand: 0, maintenance: -0.20, mineral: 29.00, plunder: -0.95 },
    2: { name: 'Marauder', colonies: 12, tax: -0.95, agriculture: -0.50, commercial: -0.95, industry: -.5, demand: 0, maintenance: -0.95, mineral: -0.95, plunder: 19 },
    3: { name: 'Viral', colonies: 12, tax: 0.20, agriculture: -0.20, commercial: -0.05, industry: -0.5, demand: 1.0, maintenance: 0, mineral: 0, plunder: -.99 },
    4: { name: 'Collective', colonies: 13, tax: -0.50, agriculture: 0.50, commercial: -0.95, industry: -0.90, demand: -0.95, maintenance: 0, mineral: -0.50, plunder: 11 },
    5: { name: 'Guardian', colonies: 10, tax: -0.85, agriculture: -0.95, commercial: -0.99, industry: -0.99, demand: -0.90, maintenance: -0.25, mineral: -0.99, plunder: -0.99 }
};

const PLANET_CLASSES = [
    ['Barren', 'Barren'], ['Icy', 'Icy'], ['Marshy', 'Marshy'], ['Forest', 'Forest'], ['Oceanic', 'Oceanic'],
    ['Rocky', 'Rocky'], ['Desert', 'Desert'], ['Balanced', 'Balanced'], ['Gas', 'Gas'],
    ['Cluster_Lvl_1', 'Cluster Lvl 1'], ['Cluster_Lvl_2', 'Cluster Lvl 2'], ['Cluster_Lvl_3', 'Cluster Lvl 3'],
    ['U_Rich', 'U.Rich'], ['U_Eden', 'U.Eden'], ['U_Spazial', 'U.Spazial'], ['U_Large', 'U.Large'], ['U_Fertile', 'U.Fertile'], ['Dead', 'Dead'],
    ['Similare_C_1', 'Similare C.1'], ['Similare_C_2', 'Similare C.2'], ['Similare_C_3', 'Similare C.3'], ['Similare_C_4', 'Similare C.4'], ['Similare_C_5', 'Similare C.5'],
    ['Assimilated_C_1', 'Assimilated C1'], ['Assimilated_C_2', 'Assimilated C2'], ['Assimilated_C_3', 'Assimilated C3'],
    ['Tainted_C_1', 'Tainted C.1'], ['Tainted_C_2', 'Tainted C.2'], ['Tainted_C_3', 'Tainted C.3'], ['Tainted_C_4', 'Tainted C.4'],
    ['Infected_C_1', 'Infected C1'], ['Infected_C_2', 'Infected C2'], ['Infected_C_3', 'Infected C3']
];

const MINERAL_TYPES = [
    ['terran_metal', 'Terran Metal'], ['red_crystal', 'Red Crystal'], ['white_crystal', 'White Crystal'],
    ['rutile', 'Rutile'], ['composite', 'Composite'], ['strafez_organism', 'Str. Organism']
];

const DEFAULT_OPTIONS = {
    turnfactor: 1, mining_colony: "Yes",
    income_section: "Show", race_mod_section: "Show", mineral_section: "Show", products_section: "Show",
    total_population: "Hide", taxes_collected: "Show", goods_sold_value: "Hide", food_made: "Hide",
    food_need: "Show", food_gained: "Hide", goods_need: "Show", goods_made: "Hide", goods_gained: "Hide",
    commerce_income: "Show", average_loyalty: "Hide", maintenance_cost: "Show", land_used: "Show",
    total_land: "Show", total_power: "Show", colony_save: "No", average_land: "Show", infra_save: "Yes",
    race_save: "No", save_market: "Yes", total_plunder: "Yes", tax_per_pop: "Show", quick_econs: "Show",
    turn_calculator: "Hide"
};

const RESET_OPTIONS = Object.assign({}, DEFAULT_OPTIONS, { mining_colony: "No" });

const SECTION_TOGGLES = [
    ['income_section', 'Income Summary'], ['race_mod_section', 'Race Mods'], ['mineral_section', 'Minerals'],
    ['products_section', 'Market / Products'], ['quick_econs', 'Quick Econ Buttons'], ['turn_calculator', 'Infra Turn Calculator']
];
const LINE_TOGGLES = [
    ['total_population', 'Total Population'], ['taxes_collected', 'Taxes Collected'], ['tax_per_pop', 'Taxes Per Pop'],
    ['goods_sold_value', 'Goods Sold Value'], ['food_made', 'Food Made'], ['food_need', 'Food Need'],
    ['food_gained', 'Food Gained'], ['goods_need', 'Goods Need'], ['goods_made', 'Goods Made'],
    ['goods_gained', 'Goods Gained'], ['commerce_income', 'Commerce Income'], ['average_loyalty', 'Average Loyalty'],
    ['maintenance_cost', 'Maintenance Cost'], ['land_used', 'Land Used'], ['total_land', 'Total Land'],
    ['total_power', 'Power Rating'], ['average_land', 'Avg Land / Planet'], ['total_plunder', 'Total Plunder']
];
const YESNO_TOGGLES = [['mining_colony', 'Keep Mining Land on Econ Buttons']];
const SAVE_TOGGLES = [
    ['colony_save', 'Save Colonies'], ['infra_save', 'Save Infrastructure'],
    ['race_save', 'Save Race'], ['save_market', 'Save Market / Mineral Settings']
];

/* ============================================================
   Mutable state
   ============================================================ */

let colony = [];
let number = 0;
let selector = 0;
let options = Object.assign({}, DEFAULT_OPTIONS);

function freshInfra() {
    return {
        housing: 0, commercial: 0, industry: 0, agriculture: 0, mining: 0,
        total() { return this.housing + this.commercial + this.industry + this.agriculture + this.mining; }
    };
}
function freshMinerals() {
    return {
        terran_metal: 0, red_crystal: 0, white_crystal: 0, rutile: 0, composite: 0, strafez_organism: 0,
        total() { return this.terran_metal + this.red_crystal + this.white_crystal + this.rutile + this.composite + this.strafez_organism; }
    };
}

let infra = freshInfra();
let minerals = freshMinerals();

let food_button_text = "Yes", goods_button_text = "Yes", rm_button_text = "Yes";
let food_button_value = 8, goods_button_value = 4, rm_button_value = 1;
let terran_metal_button_text = "No", red_crystal_button_text = "No", white_crystal_button_text = "No";
let rutile_button_text = "No", composite_button_text = "No", strafez_organism_button_text = "No";
let terran_metal_button_value = 1000, red_crystal_button_value = 1000, white_crystal_button_value = 1000;
let rutile_button_value = 1000, composite_button_value = 1000, strafez_organism_button_value = 1000;
let fleet_upkeep_value = 0;
let food_buy = 0, food_sell = 0, goods_buy = 0, goods_sell = 0, rm_buy = 0, rm_sell = 0;

let productionView = false;
let key_count_global = 0;
let keyer_timeout = null;

/* ============================================================
   Persistence
   ============================================================ */

function Save() {
    localStorage.eco_options = JSON.stringify(options);
    if (options.colony_save === 'Yes') {
        localStorage.eco_number = JSON.stringify(number);
        localStorage.eco_colony = JSON.stringify(colony);
    }
    if (options.race_save === 'Yes') {
        localStorage.eco_selector = JSON.stringify(selector);
    }
    if (options.infra_save === 'Yes') {
        localStorage.eco_infra = JSON.stringify(infra);
    }
    if (options.save_market === 'Yes') {
        localStorage.eco_food_button_text = food_button_text;
        localStorage.eco_goods_button_text = goods_button_text;
        localStorage.eco_rm_button_text = rm_button_text;
        localStorage.eco_food_button_value = JSON.stringify(food_button_value);
        localStorage.eco_goods_button_value = JSON.stringify(goods_button_value);
        localStorage.eco_rm_button_value = JSON.stringify(rm_button_value);
        localStorage.eco_terran_metal_button_text = terran_metal_button_text;
        localStorage.eco_red_crystal_button_text = red_crystal_button_text;
        localStorage.eco_white_crystal_button_text = white_crystal_button_text;
        localStorage.eco_rutile_button_text = rutile_button_text;
        localStorage.eco_composite_button_text = composite_button_text;
        localStorage.eco_strafez_organism_button_text = strafez_organism_button_text;
        localStorage.eco_terran_metal_button_value = JSON.stringify(terran_metal_button_value);
        localStorage.eco_red_crystal_button_value = JSON.stringify(red_crystal_button_value);
        localStorage.eco_white_crystal_button_value = JSON.stringify(white_crystal_button_value);
        localStorage.eco_rutile_button_value = JSON.stringify(rutile_button_value);
        localStorage.eco_composite_button_value = JSON.stringify(composite_button_value);
        localStorage.eco_strafez_organism_button_value = JSON.stringify(strafez_organism_button_value);
        localStorage.eco_fleet_upkeep_value = JSON.stringify(fleet_upkeep_value);
    }
}
window.addEventListener('beforeunload', Save);

function Load() {
    if (localStorage.eco_options) {
        try { options = Object.assign({}, DEFAULT_OPTIONS, JSON.parse(localStorage.eco_options)); } catch { /* ignore */ }
    }
    if (isNaN(options.turnfactor) || options.turnfactor <= 0) { options.turnfactor = 1; }

    if (options.colony_save === 'Yes') {
        if (localStorage.eco_number) number = JSON.parse(localStorage.eco_number);
        if (localStorage.eco_colony) colony = JSON.parse(localStorage.eco_colony);
    }
    if (options.race_save === 'Yes' && localStorage.eco_selector) {
        selector = JSON.parse(localStorage.eco_selector);
    }
    if (options.infra_save === 'Yes' && localStorage.eco_infra) {
        infra = Object.assign(freshInfra(), JSON.parse(localStorage.eco_infra));
    }
    if (options.save_market === 'Yes') {
        if (localStorage.eco_food_button_text) food_button_text = localStorage.eco_food_button_text;
        if (localStorage.eco_goods_button_text) goods_button_text = localStorage.eco_goods_button_text;
        if (localStorage.eco_rm_button_text) rm_button_text = localStorage.eco_rm_button_text;
        if (localStorage.eco_food_button_value) food_button_value = JSON.parse(localStorage.eco_food_button_value);
        if (localStorage.eco_goods_button_value) goods_button_value = JSON.parse(localStorage.eco_goods_button_value);
        if (localStorage.eco_rm_button_value) rm_button_value = JSON.parse(localStorage.eco_rm_button_value);
        if (localStorage.eco_terran_metal_button_text) terran_metal_button_text = localStorage.eco_terran_metal_button_text;
        if (localStorage.eco_red_crystal_button_text) red_crystal_button_text = localStorage.eco_red_crystal_button_text;
        if (localStorage.eco_white_crystal_button_text) white_crystal_button_text = localStorage.eco_white_crystal_button_text;
        if (localStorage.eco_rutile_button_text) rutile_button_text = localStorage.eco_rutile_button_text;
        if (localStorage.eco_composite_button_text) composite_button_text = localStorage.eco_composite_button_text;
        if (localStorage.eco_strafez_organism_button_text) strafez_organism_button_text = localStorage.eco_strafez_organism_button_text;
        if (localStorage.eco_terran_metal_button_value) terran_metal_button_value = JSON.parse(localStorage.eco_terran_metal_button_value);
        if (localStorage.eco_red_crystal_button_value) red_crystal_button_value = JSON.parse(localStorage.eco_red_crystal_button_value);
        if (localStorage.eco_white_crystal_button_value) white_crystal_button_value = JSON.parse(localStorage.eco_white_crystal_button_value);
        if (localStorage.eco_rutile_button_value) rutile_button_value = JSON.parse(localStorage.eco_rutile_button_value);
        if (localStorage.eco_composite_button_value) composite_button_value = JSON.parse(localStorage.eco_composite_button_value);
        if (localStorage.eco_strafez_organism_button_value) strafez_organism_button_value = JSON.parse(localStorage.eco_strafez_organism_button_value);
        if (localStorage.eco_fleet_upkeep_value) fleet_upkeep_value = JSON.parse(localStorage.eco_fleet_upkeep_value);
    }
}

/* ============================================================
   Helpers
   ============================================================ */

function Commas(num) {
    if (num) return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return 0;
}

function grow(startPop, targetPop, modifier, step) {
    let pop = startPop;
    let turns = 0;
    while (pop < targetPop) {
        const growth = Math.floor(Math.floor(pop * (2 * (1 + modifier))) / 100) + 1;
        const actualStep = Math.min(step, Math.ceil((targetPop - pop) / growth));
        pop += growth * actualStep;
        turns += actualStep;
    }
    return turns;
}

function growTooltip(poptarget, pop_mod) {
    const steps = [1, 3, 15, 30, 45, 90];
    let tip = 'Turns to grow pop using common increments:\n\n';
    steps.forEach((s) => {
        const amount = grow(1, poptarget, pop_mod, s);
        tip += `${s}(T) ${Commas(amount)}  # ${Math.ceil(amount / s)}\n`;
    });
    return tip.trim();
}

function Recombine_Colonies() {
    const temp = JSON.parse(JSON.stringify(colony));
    colony = [];
    let colnumber = 0;
    for (const x in temp) {
        if (temp[x]) { colony[colnumber] = temp[x]; colnumber++; }
    }
    number = Object.keys(colony).length;
}

function Capture_Switch(id) {
    colony[id].captured = colony[id].captured === 'Yes' ? 'No' : 'Yes';
}

/* ============================================================
   Econ presets — ported verbatim from ecoexample.js Econ()
   ============================================================ */

function Econ(type) {
    let pop_per_land, food_per_land, goods_per_land;
    let pop_factor = 1;
    if (races[selector].name === "Collective") { pop_factor = 2; }

    if (type === 'Clear') {
        for (const econ in colony) {
            colony[econ].commercial_land = 0;
            colony[econ].industry_land = 0;
            colony[econ].agriculture_land = 0;
            colony[econ].mining_land = 0;
            colony[econ].housing_land = 0;
        }
    }

    if (type === 'Max Loyalty') {
        for (const econ in colony) { if (colony[econ].useable === true) colony[econ].loyalty = 5000; }
    }

    if (type === 'Min Loyalty') {
        for (const econ in colony) { if (colony[econ].useable === true) colony[econ].loyalty = 50; }
    }

    if (type === 'Minimum Pop') {
        for (const econ in colony) {
            if (colony[econ].useable === true) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                colony[econ].housing_land = Math.ceil((colony[econ].land - colony[econ].mining_land) / ((infra.housing + 10) * pop_factor));
                colony[econ].commercial_land = 0;
                colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0;
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Mining') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                colony[econ].commercial_land = 0; colony[econ].industry_land = 0; colony[econ].agriculture_land = 0;
                colony[econ].housing_land = Math.ceil((colony[econ].land) / ((infra.housing + 10) * pop_factor));
                colony[econ].mining_land = colony[econ].land - colony[econ].housing_land - colony[econ].industry_land - colony[econ].agriculture_land - colony[econ].commercial_land;
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Tax') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                colony[econ].commercial_land = 0; colony[econ].industry_land = 0; colony[econ].agriculture_land = 0;
                colony[econ].housing_land = colony[econ].land - colony[econ].commercial_land - colony[econ].industry_land - colony[econ].agriculture_land - colony[econ].mining_land;
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Commercial') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                colony[econ].housing_land = Math.ceil((colony[econ].land - colony[econ].mining_land) / ((infra.housing + 10) * pop_factor));
                colony[econ].industry_land = 0; colony[econ].agriculture_land = 0;
                colony[econ].commercial_land = colony[econ].land - colony[econ].housing_land - colony[econ].industry_land - colony[econ].agriculture_land - colony[econ].mining_land;
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Industrial') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                colony[econ].commercial_land = 0;
                colony[econ].housing_land = Math.ceil((colony[econ].land - colony[econ].mining_land) / ((infra.housing + 10) * pop_factor));
                colony[econ].agriculture_land = 0;
                colony[econ].industry_land = colony[econ].land - colony[econ].housing_land - colony[econ].commercial_land - colony[econ].agriculture_land - colony[econ].mining_land;
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Agriculture') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                if (infra.commercial >= 5) { colony[econ].commercial_land = 5; } else { colony[econ].commercial_land = 0; }
                colony[econ].industry_land = 0;
                colony[econ].housing_land = Math.ceil((colony[econ].land - colony[econ].mining_land) / ((infra.housing + 10) * pop_factor));
                colony[econ].agriculture_land = colony[econ].land - colony[econ].housing_land - colony[econ].industry_land - colony[econ].commercial_land - colony[econ].mining_land;
                if (colony[econ].agriculture_mod === -1) { colony[econ].agriculture_land = 0; }
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Tax & Agri') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                let food_factor;
                if (infra.commercial >= 5) {
                    colony[econ].commercial_land = 5;
                    food_factor = (1 + ((((infra.commercial / 100) + (colony[econ].commercial_land / 10000)) / 5)) + 0.2);
                } else {
                    colony[econ].commercial_land = 0; food_factor = 1;
                }
                pop_per_land = (infra.housing + 10) * pop_factor;
                colony[econ].industry_land = 0;
                food_per_land = ((((infra.agriculture * 0.1) + 1)) * (races[selector].agriculture + 1)) * (colony[econ].agriculture_mod + 1);
                food_per_land = food_per_land * (food_factor);
                colony[econ].housing_land = Math.floor(((colony[econ].land - 5 - colony[econ].mining_land) / (((pop_per_land / 10) / food_per_land) + 1)));
                colony[econ].agriculture_land = colony[econ].land - colony[econ].housing_land - colony[econ].industry_land - colony[econ].commercial_land - colony[econ].mining_land;

                if (colony[econ].agriculture_mod === -1) {
                    colony[econ].commercial_land = 0; colony[econ].agriculture_land = 0; colony[econ].industry_land = 0;
                    colony[econ].housing_land = Math.ceil(colony[econ].land - colony[econ].mining_land);
                }
                if (races[selector].name === "Guardian") { colony[econ].agriculture_land = 0; colony[econ].mining_land = 0; colony[econ].housing_land = colony[econ].land; }
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Tax & Industry') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                goods_per_land = (((infra.industry * 0.1) + 1)) * (races[selector].industry + 1) * (colony[econ].industry_mod + 1);
                pop_per_land = (infra.housing + 10) * pop_factor;
                colony[econ].commercial_land = 0; colony[econ].agriculture_land = 0;
                colony[econ].housing_land = Math.floor((colony[econ].land - colony[econ].mining_land) / ((((pop_per_land / 10) * (races[selector].demand + 1)) / goods_per_land) + 1));
                colony[econ].industry_land = colony[econ].land - colony[econ].housing_land - colony[econ].agriculture_land - colony[econ].commercial_land - colony[econ].mining_land;
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Tax & Agri & Industry') {
        for (const econ in colony) {
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                let food_factor;
                if (infra.commercial >= 5) {
                    colony[econ].commercial_land = 5;
                    food_factor = ((1 + (((infra.commercial / 100) + (colony[econ].commercial_land / 10000)) / 5)) + 0.2);
                } else {
                    colony[econ].commercial_land = 0; food_factor = 1;
                }
                food_per_land = ((((infra.agriculture * 0.1) + 1)) * (races[selector].agriculture + 1)) * (colony[econ].agriculture_mod + 1);
                food_per_land = food_per_land * food_factor;
                goods_per_land = (((infra.industry * 0.1) + 1)) * (races[selector].industry + 1) * (colony[econ].industry_mod + 1);
                pop_per_land = (infra.housing + 10) * pop_factor;

                if (infra.commercial >= 5) {
                    colony[econ].housing_land = Math.ceil((colony[econ].land - 5 - colony[econ].mining_land) / ((((pop_per_land / 10) * (races[selector].demand + 1)) / goods_per_land) + ((pop_per_land / 10) / food_per_land) + 1));
                } else {
                    colony[econ].housing_land = Math.ceil((colony[econ].land - colony[econ].mining_land) / ((((pop_per_land / 10) * (races[selector].demand + 1)) / goods_per_land) + ((pop_per_land / 10) / food_per_land) + 1));
                }
                if (colony[econ].housing_land * (infra.housing + 10) <= colony[econ].land) { colony[econ].housing_land = Math.ceil(colony[econ].land - colony[econ].mining_land - colony[econ].commercial_land / (infra.housing + 10)); }
                colony[econ].agriculture_land = Math.ceil((colony[econ].housing_land * pop_per_land / 10) / food_per_land);
                colony[econ].industry_land = colony[econ].land - colony[econ].housing_land - colony[econ].agriculture_land - colony[econ].commercial_land - colony[econ].mining_land;

                if (colony[econ].industry_land < 1) { colony[econ].industry_land = 0; }
                if (colony[econ].industry_land + colony[econ].commercial_land + colony[econ].agriculture_land + colony[econ].housing_land + colony[econ].mining_land > colony[econ].land) { colony[econ].industry_land = 0; }
                if (colony[econ].industry_land + colony[econ].commercial_land + colony[econ].agriculture_land + colony[econ].housing_land + colony[econ].mining_land > colony[econ].land) { colony[econ].agriculture_land = 0; }

                if (colony[econ].agriculture_mod === -1) {
                    colony[econ].commercial_land = 0; colony[econ].agriculture_land = 0;
                    colony[econ].housing_land = Math.ceil((colony[econ].land - colony[econ].mining_land) / ((((pop_per_land / 10) * (races[selector].demand + 1)) / goods_per_land) + 1));
                    colony[econ].industry_land = colony[econ].land - colony[econ].housing_land - colony[econ].mining_land;
                }
                if (races[selector].name === "Guardian") { colony[econ].agriculture_land = 0; colony[econ].mining_land = 0; colony[econ].housing_land = colony[econ].land; }
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Tax & Comm.') {
        for (const econ in colony) {
            colony[econ].industry_land = 0; colony[econ].agriculture_land = 0;
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                const popPerLand = (infra.housing + 10) * pop_factor;
                const goodsPerCommLand = (infra.commercial * 0.08 + 1) * (races[selector].commercial + 1) * (colony[econ].industry_mod + 1);
                const demandPerPop = races[selector].demand + 1;
                const k_goods = (popPerLand / 10) * demandPerPop / (goodsPerCommLand);
                const housing = colony[econ].land / (1 + k_goods);
                colony[econ].housing_land = Math.floor(housing);
                if (colony[econ].housing_land * popPerLand <= colony[econ].land) { colony[econ].housing_land = Math.floor(colony[econ].land / (popPerLand)); }
                colony[econ].commercial_land = colony[econ].land - colony[econ].housing_land - colony[econ].mining_land;
                if (races[selector].name === "Guardian") { colony[econ].agriculture_land = 0; colony[econ].mining_land = 0; colony[econ].housing_land = colony[econ].land; }
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }

    if (type === 'Tax & Agri & Comm') {
        for (const econ in colony) {
            colony[econ].industry_land = 0;
            if (colony[econ].useable === true && colony[econ].land >= 5) {
                if (options.mining_colony !== "Yes") colony[econ].mining_land = 0;
                const popPerLand = (infra.housing + 10) * pop_factor;
                const goodsPerCommLand = (infra.commercial * 0.08 + 1) * (races[selector].commercial + 1) * (colony[econ].industry_mod + 1);
                const foodBasePerLand = (((infra.agriculture * 0.1) + 1)) * (races[selector].agriculture + 1) * (colony[econ].agriculture_mod + 1);
                const demandPerPop = races[selector].demand + 1;
                let housing = colony[econ].land * 0.65;

                for (let i = 0; i < 4; i++) {
                    colony[econ].commercial_land = colony[econ].land - colony[econ].housing_land - colony[econ].industry_land - colony[econ].agriculture_land - colony[econ].mining_land;
                    let foodFactor = 1;
                    if (infra.commercial >= 5) {
                        foodFactor = ((1 + (((infra.commercial / 100) + (colony[econ].commercial_land / 10000)) / 5)) + 0.2);
                    }
                    const foodPerLand = foodBasePerLand * foodFactor;
                    const k_food = (popPerLand / 10) / foodPerLand;
                    const k_goods = (popPerLand / 10) * demandPerPop / (goodsPerCommLand);
                    housing = colony[econ].land / (1 + k_goods + k_food);
                    colony[econ].housing_land = Math.floor(housing);
                }

                if (colony[econ].housing_land * popPerLand <= colony[econ].land) { colony[econ].housing_land = Math.floor(colony[econ].land / (popPerLand)); }
                let finalFoodFactor = 1;
                if (infra.commercial >= 5) {
                    finalFoodFactor = ((1 + (((infra.commercial / 100) + (colony[econ].commercial_land / 10000)) / 5)) + 0.2);
                }
                const finalFoodPerLand = foodBasePerLand * finalFoodFactor;

                colony[econ].agriculture_land = Math.ceil((colony[econ].housing_land * popPerLand / 10) / finalFoodPerLand);
                colony[econ].commercial_land = colony[econ].land - colony[econ].housing_land - colony[econ].industry_land - colony[econ].agriculture_land - colony[econ].mining_land;

                if (colony[econ].agriculture_land <= 0) { colony[econ].agriculture_land = 0; }
                if (colony[econ].housing_land <= 1) { colony[econ].housing_land = 1; }

                if (colony[econ].agriculture_mod === -1) {
                    const k_goods2 = (popPerLand / 10) * demandPerPop / (goodsPerCommLand);
                    housing = colony[econ].land / (1 + k_goods2);
                    colony[econ].housing_land = Math.floor(housing);
                    if (colony[econ].housing_land <= colony[econ].land) { colony[econ].housing_land = Math.floor(colony[econ].land / (popPerLand)); }
                    colony[econ].commercial_land = colony[econ].land - colony[econ].housing_land;
                }
                if (races[selector].name === "Guardian") { colony[econ].agriculture_land = 0; colony[econ].mining_land = 0; colony[econ].housing_land = colony[econ].land; }
            } else {
                colony[econ].housing_land = 1; colony[econ].commercial_land = 0; colony[econ].industry_land = 0;
                colony[econ].agriculture_land = 0; colony[econ].mining_land = 1;
            }
        }
    }
}

function applyEcon(type) {
    if (type === 'Tax & Agri & Comm') {
        for (let i = 0; i < 7; i++) Econ(type);
    } else {
        Econ(type);
    }
    Create_Colony();
}

/* ============================================================
   Core recompute — ported from Create_Colony() math (no HTML strings)
   ============================================================ */

function Create_Colony(addNew) {
    if (isNaN(infra.housing)) infra.housing = 0;
    if (isNaN(infra.commercial)) infra.commercial = 0;
    if (isNaN(infra.industry)) infra.industry = 0;
    if (isNaN(infra.agriculture)) infra.agriculture = 0;
    if (isNaN(infra.mining)) infra.mining = 0;

    minerals = freshMinerals();

    if (addNew === true && number <= races[selector].colonies + 2) {
        if (number <= 0) {
            colony[number] = {
                type: 'Balanced', land: 500, loyalty: 50, population: 0,
                housing_land: 0, commercial_land: 0, industry_land: 0, agriculture_land: 0,
                food_req: 0, goods_req: 0, food_produced: 0, goods_produced: 0,
                mineral_name: 'terran_metal', taxes_collected: 0, comm_collected: 0,
                agriculture_mod: 0, mining_mod: 0, industry_mod: 0, planets: 1, pop_mod: 0,
                mining_land: 0, captured: "No", plunder_value: 0, infected: false, useable: false, planets_modified: false
            };
        } else {
            const prev = colony[number - 1];
            colony[number] = {
                type: prev.type, land: prev.land, loyalty: prev.loyalty, population: 0,
                housing_land: prev.housing_land, commercial_land: prev.commercial_land,
                industry_land: prev.industry_land, agriculture_land: prev.agriculture_land,
                food_req: 0, goods_req: 0, food_produced: 0, goods_produced: 0,
                mineral_name: prev.mineral_name, taxes_collected: 0, comm_collected: 0,
                agriculture_mod: 0, mining_mod: 0, industry_mod: 0, planets: 0, pop_mod: 0,
                mining_land: prev.mining_land, captured: prev.captured, plunder_value: 0,
                infected: prev.infected, useable: false, planets_modified: false
            };
        }
        number++;
    }

    let planet_count = 0;
    let planet_count2 = 0;

    let rm_made = 0;
    let rm_need = 0;
    for (const tc in colony) {
        rm_made += colony[tc].food_produced;
        rm_need += colony[tc].industry_land;
        rm_need += colony[tc].commercial_land * 2;
    }

    for (const cycler in colony) {
        const c = colony[cycler];
        c.industry_mod = planets_industry_mod[c.type];
        c.agriculture_mod = planets_agriculture_mod[c.type];
        c.mining_mod = planets_mining_mod[c.type];
        c.pop_mod = planets_pop_mod[c.type];

        if (isNaN(c.land)) c.land = 0;
        if (isNaN(c.loyalty)) c.loyalty = 0;
        if (isNaN(c.population)) c.population = 0;
        if (isNaN(c.housing_land)) c.housing_land = 0;
        if (isNaN(c.commercial_land)) c.commercial_land = 0;
        if (isNaN(c.industry_land)) c.industry_land = 0;
        if (isNaN(c.agriculture_land)) c.agriculture_land = 0;
        if (isNaN(c.food_req)) c.food_req = 0;
        if (isNaN(c.goods_req)) c.goods_req = 0;
        if (isNaN(c.food_produced)) c.food_produced = 0;
        if (isNaN(c.goods_produced)) c.goods_produced = 0;
        if (isNaN(c.taxes_collected)) c.taxes_collected = 0;
        if (isNaN(c.comm_collected)) c.comm_collected = 0;
        if (isNaN(c.mining_land)) c.mining_land = 0;
        if (c.captured !== 'No' && c.captured !== 'Yes') c.captured = 'No';
        if (isNaN(c.plunder_value)) c.plunder_value = 0;

        c.infected = false;
        if (c.planets_modified === false) {
            c.planets = 1;
            const clusterCounts = {
                Cluster_Lvl_1: 5, Cluster_Lvl_2: 25, Cluster_Lvl_3: 125,
                Similare_C_1: 1, Similare_C_2: 4, Similare_C_3: 16, Similare_C_4: 64, Similare_C_5: 256,
                Assimilated_C_1: 5, Assimilated_C_2: 25, Assimilated_C_3: 125,
                Tainted_C_1: 1, Tainted_C_2: 4, Tainted_C_3: 16, Tainted_C_4: 64,
                Infected_C_1: 5, Infected_C_2: 25, Infected_C_3: 125
            };
            if (clusterCounts[c.type]) c.planets = clusterCounts[c.type];
        }

        const infectedTypes = ['Similare_C_1', 'Similare_C_2', 'Similare_C_3', 'Similare_C_4', 'Similare_C_5',
            'Assimilated_C_1', 'Assimilated_C_2', 'Assimilated_C_3', 'Tainted_C_1', 'Tainted_C_2', 'Tainted_C_3',
            'Tainted_C_4', 'Infected_C_1', 'Infected_C_2', 'Infected_C_3'];
        if (infectedTypes.includes(c.type)) c.infected = true;

        if (races[selector].name !== "Collective" && races[selector].name !== "Viral") {
            planet_count += c.planets;
            c.useable = c.infected !== true;
        }
        if (races[selector].name === "Collective" || races[selector].name === "Viral") {
            if (c.infected === true) { planet_count += c.planets; c.useable = true; }
        }
        planet_count2 += c.planets;

        if (c.useable === true) {
            minerals[c.mineral_name] += Math.ceil(Math.sqrt((c.mining_land * (c.planets * 0.3)) * ((0.4 * infra.mining) + 1) * ((1 + c.mining_mod) * (races[selector].mineral + 1))));
        }

        if (c.agriculture_mod <= -1) c.agriculture_land = 0;
        if (c.mining_mod <= -1) c.mining_land = 0;

        if (c.captured === 'No') {
            if (races[selector].name === "Collective") {
                c.population = 2 * (parseInt(c.housing_land) || 0) * (parseInt(infra.housing) + 10);
            } else {
                c.population = (parseInt(c.housing_land) || 0) * (parseInt(infra.housing) + 10);
            }
        }

        let food_factor;
        if (c.commercial_land >= 5 && infra.commercial >= 5) {
            food_factor = ((1 + (((infra.commercial / 100) + (c.commercial_land / 10000)) / 5)) + 0.2);
        } else {
            food_factor = 1;
        }

        if (c.useable === true) {
            c.food_produced = (((c.agriculture_land * ((infra.agriculture * 0.1) + 1)) * (races[selector].agriculture + 1)) * (c.agriculture_mod + 1)) * food_factor;
        } else {
            c.food_produced = 0;
        }

        rm_made = Math.ceil(rm_made);

        if (rm_button_text === 'No') {
            if (rm_made >= rm_need) {
                c.goods_produced = (parseInt(c.industry_land) * ((parseInt(infra.industry) * 0.1) + 1)) * (races[selector].industry + 1) * (c.industry_mod + 1);
                rm_made -= c.industry_land + (c.commercial_land * 2);
                c.goods_produced += (parseInt(c.commercial_land * (((parseInt(infra.commercial) * 0.08) + 1)) * (races[selector].commercial + 1) * (c.industry_mod + 1)));
            } else if (rm_made > c.industry_land + (c.commercial_land * 2)) {
                c.goods_produced = (parseInt(c.industry_land) * ((parseInt(infra.industry) * 0.1) + 1)) * (races[selector].industry + 1) * (c.industry_mod + 1);
                rm_made -= c.industry_land + (c.commercial_land * 2);
                c.goods_produced += (parseInt(c.commercial_land * (((parseInt(infra.commercial) * 0.08) + 1)) * (races[selector].commercial + 1) * (c.industry_mod + 1)));
            } else if (rm_made === c.industry_land + (c.commercial_land * 2)) {
                c.goods_produced = (parseInt(c.industry_land) * ((parseInt(infra.industry) * 0.1) + 1)) * (races[selector].industry + 1) * (c.industry_mod + 1);
                rm_made = 0;
                c.goods_produced += (parseInt(c.commercial_land * (((parseInt(infra.commercial) * 0.08) + 1)) * (races[selector].commercial + 1) * (c.industry_mod + 1)));
            } else {
                c.goods_produced = ((rm_made) * ((parseInt(infra.industry) * 0.1) + 1)) * (races[selector].industry + 1) * (c.industry_mod + 1);
                rm_made = 0;
            }
        }

        if (rm_button_text === 'Yes') {
            c.goods_produced = (parseInt(c.industry_land) * ((parseInt(infra.industry) * 0.1) + 1)) * (races[selector].industry + 1) * (c.industry_mod + 1);
            c.goods_produced += (parseInt(c.commercial_land * (((parseInt(infra.commercial) * 0.08) + 1)) * (races[selector].commercial + 1) * (c.industry_mod + 1)));
        }

        c.comm_collected = c.useable === true ? (c.commercial_land * ((infra.commercial * 0.5) + 5)) * (races[selector].commercial + 1) : 0;
        c.taxes_collected = ((c.population * (c.loyalty / 5000)) + (c.population / 2)) * (races[selector].tax + 1);
        c.food_req = Math.ceil(c.population / 10);
        if (races[selector].name === "Guardian") c.food_req = 0;
        c.goods_req = Math.ceil(c.population / 10 * (races[selector].demand + 1));

        c.plunder_value = (((c.population * 2500) + ((5500 * (c.commercial_land + c.agriculture_land + c.housing_land + c.industry_land + c.mining_land) ** 2) / c.land) + (750000 * c.planets)) / 15) * (races[selector].plunder + 1);
    }

    const totals = computeTotals(planet_count, planet_count2);
    renderAll(totals);
}

/* ============================================================
   Aggregate totals — ported from Pager()'s income math
   ============================================================ */

function computeTotals(planet_count, planet_count2) {
    let commerce_collected = 0, food_made = 0, goods_made = 0, loyalty_total = 0, land_total = 0,
        population_total = 0, taxes_total = 0, infra_total = 0, industry_total = 0, plunder_total = 0,
        commercial_used = 0, food_need_per = 0, goods_need_per = 0, temp_taxes = 0;

    for (const cycler in colony) {
        const c = colony[cycler];

        if (races[selector].name === "Collective" || races[selector].name === "Viral") {
            if (c.infected === true) {
                commerce_collected += c.comm_collected;
                food_need_per += races[selector].name !== 'Guardian' ? Math.floor(c.population / 10) : 0;
                goods_need_per += Math.floor((c.population / 10) * (races[selector].demand + 1));
                food_made += c.food_produced;
                goods_made += c.goods_produced;
                loyalty_total += c.loyalty;
                industry_total += c.industry_land;
                commercial_used += c.commercial_land * 2;
                c.useable = true;
            } else {
                c.useable = false;
            }
            land_total += c.land;
            population_total += c.population;
            taxes_total += Math.round(c.taxes_collected);
        }

        if (races[selector].name !== "Collective" && races[selector].name !== "Viral") {
            commerce_collected += c.comm_collected;
            food_need_per += races[selector].name !== 'Guardian' ? Math.floor(c.population / 10) : 0;
            goods_need_per += Math.floor((c.population / 10) * (races[selector].demand + 1));
            food_made += c.food_produced;
            goods_made += c.goods_produced;
            loyalty_total += c.loyalty;
            population_total += c.population;
            taxes_total += Math.round(c.taxes_collected);
            industry_total += c.industry_land;
            land_total += c.land;
            commercial_used += c.commercial_land * 2;
            c.useable = c.infected === false;
        }

        infra_total += c.housing_land + c.commercial_land + c.industry_land + c.agriculture_land + c.mining_land;
        plunder_total += c.plunder_value;
        temp_taxes += (((c.population * (c.loyalty / 5000)) + (c.population / 2)) * (races[selector].tax + 1));
    }
    temp_taxes = Math.ceil(temp_taxes);

    let food_need = 0;
    if (races[selector].name !== 'Guardian') food_need = Math.round(population_total / 10);
    const goods_need = Math.floor((population_total / 10) * (races[selector].demand + 1));

    if (goods_button_text === 'Yes') {
        if (goods_made <= goods_need_per) goods_buy = (goods_need_per - goods_made) * (goods_button_value);
        if (goods_made > goods_need_per) goods_sell = (goods_made - goods_need_per) * (goods_button_value);
    }
    if (food_button_text === 'Yes') {
        if (food_made <= food_need) food_buy = (food_need - food_made) * (food_button_value);
        if (food_made > food_need) food_sell = (food_made - food_need) * (food_button_value);
    }
    if (rm_button_text === 'Yes') {
        if (industry_total > Math.floor(food_made)) rm_buy += parseInt(Math.floor(goods_made * .3) - Math.floor(food_made)) * (rm_button_value);
        if (industry_total < Math.floor(food_made)) rm_sell += parseInt(Math.floor(food_made) - Math.floor(goods_made * .3)) * (rm_button_value);
        if (commercial_used > Math.floor(food_made)) rm_buy += parseInt(commercial_used - Math.floor(food_made)) * (rm_button_value);
        if (commercial_used < Math.floor(food_made)) rm_sell += parseInt(Math.floor(food_made) - commercial_used) * (rm_button_value);
    }

    const total_power_rating = Math.round(((infra_total * (5 + (land_total / 250000))) + (planet_count2 * 1000)));

    let income_info = 0;
    if (goods_button_text === 'No') {
        income_info = goods_made >= goods_need_per
            ? (temp_taxes + (Math.floor(goods_need_per * 5.5)) + Math.floor(commerce_collected)) - Math.floor((infra_total * (races[selector].maintenance + 1)))
            : (temp_taxes + (Math.floor(goods_made * 5.5)) + Math.floor(commerce_collected)) - Math.floor((infra_total * (races[selector].maintenance + 1)));
    }
    if (goods_button_text === 'Yes') {
        if (goods_made >= goods_need) {
            income_info = (temp_taxes + (Math.floor(goods_need_per * 5.5)) + Math.floor(commerce_collected)) - Math.floor((infra_total * (races[selector].maintenance + 1)));
            income_info += Math.floor(goods_sell);
        } else {
            income_info = (temp_taxes + (Math.floor(goods_need_per * 5.5)) + Math.floor(commerce_collected)) - Math.floor((infra_total * (races[selector].maintenance + 1)));
            income_info -= Math.floor(goods_buy);
        }
    }
    if (food_button_text === 'Yes') {
        if (food_made <= food_need) income_info -= Math.floor(food_buy);
        if (food_made > food_need) income_info += Math.floor(food_sell);
    }
    if (rm_button_text === 'Yes') {
        income_info += Math.floor(rm_sell);
        income_info -= Math.floor(rm_buy);
    }

    const incomenofleet = income_info;
    income_info -= fleet_upkeep_value;

    if (terran_metal_button_text === 'Yes') income_info += Math.round(minerals.terran_metal * terran_metal_button_value);
    if (red_crystal_button_text === 'Yes') income_info += Math.round(minerals.red_crystal * red_crystal_button_value);
    if (white_crystal_button_text === 'Yes') income_info += Math.round(minerals.white_crystal * white_crystal_button_value);
    if (rutile_button_text === 'Yes') income_info += Math.round(minerals.rutile * rutile_button_value);
    if (composite_button_text === 'Yes') income_info += Math.round(minerals.composite * composite_button_value);
    if (strafez_organism_button_text === 'Yes') income_info += Math.round(minerals.strafez_organism * strafez_organism_button_value);

    return {
        commerce_collected, food_made, food_need, goods_made, goods_need, loyalty_total, land_total,
        population_total, taxes_total, infra_total, industry_total, plunder_total, commercial_used,
        food_need_per, goods_need_per, temp_taxes, total_power_rating, income_info, incomenofleet,
        planet_count, planet_count2
    };
}

/* ============================================================
   Rendering
   ============================================================ */

const el = (id) => document.getElementById(id);

function renderAll(totals) {
    renderColonyRows();
    renderProductionRows();
    renderRaceMods();
    renderMinerals(totals);
    renderIncomeSummary(totals);
    syncStaticControls();
    applyOptionVisibility();
}

function landMax(c, excludeField) {
    const fields = ['housing_land', 'commercial_land', 'industry_land', 'agriculture_land', 'mining_land'];
    let used = 0;
    fields.forEach((f) => { if (f !== excludeField) used += c[f] || 0; });
    return Math.max(0, c.land - used);
}

function classOptionsHtml(selected) {
    return PLANET_CLASSES.map(([v, l]) => `<option value="${v}"${v === selected ? ' selected' : ''}>${l}</option>`).join('');
}
function mineralOptionsHtml(selected) {
    return MINERAL_TYPES.map(([v, l]) => `<option value="${v}"${v === selected ? ' selected' : ''}>${l}</option>`).join('');
}

function renderColonyRows() {
    const body = el('eco-colony-rows');
    if (!body) return;

    const rows = [];
    for (const cycler in colony) {
        const c = colony[cycler];
        const poptarget = parseInt(c.population) || 0;
        const tip = growTooltip(poptarget, c.pop_mod || 0);
        const popValue = c.captured === 'No'
            ? Commas(races[selector].name === 'Collective' ? 2 * (parseInt(c.housing_land) || 0) * (parseInt(infra.housing) + 10) : (parseInt(c.housing_land) || 0) * (parseInt(infra.housing) + 10))
            : c.population;

        rows.push(`
            <tr data-index="${cycler}">
                <td><button type="button" class="eco-cap-btn" data-action="capture" title="Click to toggle stolen colony.">${c.captured}</button></td>
                <td><input type="text" size="2" data-field="planets" value="${c.planets}" title="Total planets in this colony."></td>
                <td><select data-field="type" title="Planet class">${classOptionsHtml(c.type)}</select></td>
                <td><input type="number" step="1" min="0" max="9999999" data-field="land" value="${c.land}" title="Total land on the colony."></td>
                <td><input type="text" size="10" ${c.captured === 'No' ? 'disabled' : ''} data-field="population" value="${popValue}" title="${tip}"></td>
                <td><input type="number" size="1" data-field="loyalty" value="${c.loyalty}" title="Colony loyalty."></td>
                <td><input type="number" step="1" min="0" max="${landMax(c, 'housing_land')}" data-field="housing_land" value="${parseInt(c.housing_land) || 0}" title="Land used for housing."></td>
                <td><input type="number" step="1" min="0" max="${landMax(c, 'commercial_land')}" data-field="commercial_land" value="${c.commercial_land}" title="Land used for commercial."></td>
                <td><input type="number" step="1" min="0" max="${landMax(c, 'industry_land')}" data-field="industry_land" value="${c.industry_land}" title="Land used for industry."></td>
                <td><input type="number" step="1" min="0" max="${c.agriculture_mod > -1 ? landMax(c, 'agriculture_land') : 0}" data-field="agriculture_land" value="${c.agriculture_land}" ${c.agriculture_mod > -1 ? '' : 'disabled'} title="Land used for agriculture."></td>
                <td><input type="number" step="1" min="0" max="${c.mining_mod > -1 ? landMax(c, 'mining_land') : 0}" data-field="mining_land" value="${c.mining_land}" ${c.mining_mod > -1 ? '' : 'disabled'} title="Land used for mining."></td>
                <td><select data-field="mineral_name" title="Colony's mineral type">${mineralOptionsHtml(c.mineral_name)}</select></td>
                <td><button type="button" class="eco-remove-btn" data-action="remove" title="Plunder Value: $${Commas(Math.floor((c.plunder_value * 100) / 100))}">×</button></td>
            </tr>`);
    }
    body.innerHTML = rows.join('');
}

function renderProductionRows() {
    const body = el('eco-production-rows');
    if (!body) return;
    const rows = [];
    for (const cycler in colony) {
        const c = colony[cycler];
        let mineralOut = 0;
        if (c.useable === true) {
            mineralOut = Math.ceil(((Math.sqrt((c.mining_land * (c.planets * 0.3)) * ((0.4 * infra.mining) + 1) * ((1 + c.mining_mod) * (races[selector].mineral + 1)))) * 100) / 100);
        }
        rows.push(`<tr>
            <td>${(c.type || '').replace(/_/g, ' ')}</td>
            <td>${Commas(c.land)}</td>
            <td>$${Commas(Math.ceil(c.taxes_collected))}</td>
            <td>$${Commas(Math.floor(c.comm_collected))}</td>
            <td>${Commas(Math.ceil(c.food_req))}</td>
            <td>${Commas(Math.ceil(c.food_produced))}</td>
            <td>${Commas(Math.ceil(c.goods_req))}</td>
            <td>${Commas(Math.ceil(c.goods_produced))}</td>
            <td>${Commas(mineralOut)}</td>
        </tr>`);
    }
    body.innerHTML = rows.join('');
}

function renderRaceMods() {
    const race = races[selector];
    const set = (id, val, positive) => {
        const node = el(id);
        if (!node) return;
        node.textContent = (val >= 0 ? '+' : '') + val;
        node.classList.toggle('eco-negative', !positive);
    };
    el('eco-race-name') && (el('eco-race-name').textContent = race.name);
    el('eco-race-colonies') && (el('eco-race-colonies').textContent = race.colonies);
    set('eco-mod-tax', Commas(Math.round(race.tax * 1000) / 10) + '%', race.tax >= 0);
    set('eco-mod-agriculture', Math.round(race.agriculture * 1000) / 10 + '%', race.agriculture >= 0);
    set('eco-mod-commercial', Math.round(race.commercial * 1000) / 10 + '%', race.commercial >= 0);
    set('eco-mod-industry', Math.round(race.industry * 1000) / 10 + '%', race.industry >= 0);
    set('eco-mod-demand', Math.round(race.demand * 1000) / 10 + '%', race.demand >= 0);
    set('eco-mod-maintenance', Math.floor(race.maintenance * 1000) / 10 + '%', race.maintenance >= 0);
    set('eco-mod-mineral', (race.mineral * 1000) / 10 + '%', race.mineral >= 0);
    set('eco-mod-plunder', Math.round(race.plunder * 1000) / 10 + '%', race.plunder >= 0);
}

function renderMinerals(totals) {
    const rows = [
        ['terran_metal', terran_metal_button_text, terran_metal_button_value],
        ['red_crystal', red_crystal_button_text, red_crystal_button_value],
        ['white_crystal', white_crystal_button_text, white_crystal_button_value],
        ['rutile', rutile_button_text, rutile_button_value],
        ['composite', composite_button_text, composite_button_value],
        ['strafez_organism', strafez_organism_button_text, strafez_organism_button_value]
    ];
    MINERAL_TYPES.forEach(([key, label], i) => {
        const [, text, value] = rows[i];
        const amountEl = el(`eco-mineral-amount-${key}`);
        if (amountEl) amountEl.textContent = `${label}: +${Commas(Math.ceil(minerals[key]))}`;
        const toggleEl = el(`eco-mineral-toggle-${key}`);
        if (toggleEl) toggleEl.textContent = text;
        const priceEl = el(`eco-mineral-price-${key}`);
        if (priceEl) priceEl.value = value;
    });

    el('eco-minerals-total') && (el('eco-minerals-total').textContent = Commas(minerals.total()));
    el('eco-planet-count') && (el('eco-planet-count').textContent = Commas(totals.planet_count2));
    el('eco-fleet-upkeep') && (el('eco-fleet-upkeep').value = fleet_upkeep_value);

    const freeUpkeepEl = el('eco-free-upkeep');
    if (freeUpkeepEl) {
        if (fleet_upkeep_value < (totals.incomenofleet * .047619)) {
            freeUpkeepEl.hidden = false;
            freeUpkeepEl.textContent = 'Max free fleet upkeep: +$' + Commas(Math.floor(totals.incomenofleet * .047619) - fleet_upkeep_value);
        } else {
            freeUpkeepEl.hidden = true;
        }
    }
}

function renderIncomeSummary(totals) {
    const {
        commerce_collected, food_made, food_need, goods_made, goods_need, loyalty_total, land_total,
        population_total, taxes_total, infra_total, total_power_rating, income_info
    } = totals;

    const setLine = (key, text) => { const node = el(`eco-line-${key}`); if (node) node.textContent = text; };

    setLine('total_population', 'Total Population: ' + Commas(population_total));
    setLine('taxes_collected', 'Taxes Collected: ' + Commas(Math.floor(taxes_total)));
    setLine('tax_per_pop', 'Taxes Per Pop: ' + (population_total !== 0 && taxes_total !== 0 ? Commas(Math.floor(taxes_total / population_total * 1000) / 1000) : 0));

    let goodsSoldValue;
    if (goods_button_text === 'No') {
        goodsSoldValue = goods_made >= goods_need ? Math.ceil(goods_need * 5.5) : Math.ceil(goods_made * 5.5);
    } else {
        goodsSoldValue = Math.ceil(goods_need * 5.5);
    }
    setLine('goods_sold_value', 'Goods Sold Value: ' + Commas(goodsSoldValue));

    setLine('food_made', 'Food Made: ' + Commas(Math.floor(food_made)));
    setLine('food_need', 'Food Need: ' + Commas(Math.floor(food_need)));
    setLine('food_gained', 'Food Gained: ' + (food_button_text === 'Yes' ? Commas(Math.floor(food_made) - Math.floor(totals.food_need_per)) : '0'));
    setLine('goods_need', 'Goods Need: ' + Commas(goods_need));
    setLine('goods_made', 'Goods Made: ' + Commas(Math.floor(goods_made)));
    setLine('goods_gained', 'Goods Gained: ' + (goods_button_text === 'No' ? Commas(Math.floor(goods_made) - Math.floor(totals.goods_need_per)) : '0'));
    setLine('commerce_income', 'Commerce Income: ' + Commas(Math.floor(commerce_collected)));
    setLine('average_loyalty', 'Average Loyalty: ' + Commas(Math.floor(loyalty_total / (Object.keys(colony).length || 1))));
    setLine('maintenance_cost', 'Maintenance Cost: ' + Commas(Math.floor(infra_total * (races[selector].maintenance + 1))));
    setLine('land_used', 'Land Used: ' + Commas(infra_total) + (totals.planet_count > 0 ? ' (Avg ' + Commas(Math.round(infra_total / totals.planet_count * 100) / 100) + '/plnt)' : ' (Avg 0/plnt)'));
    setLine('total_land', 'Total Land Avail: ' + Commas(land_total));
    setLine('total_power', 'Power Rating: ' + Commas(total_power_rating));
    setLine('average_land', 'Avg Land / Planet: ' + (land_total !== 0 ? Commas(Math.round(land_total / totals.planet_count2 * 100) / 100) : 0));
    setLine('total_plunder', 'Tot. Plunder: $' + Commas(Math.round((totals.plunder_total * 100) / 100)));

    const tempcredits = income_info;
    const temp = Commas(options.turnfactor * income_info);
    const creditsText = income_info > 0 ? '+' + temp : temp;
    const creditsEl = el('eco-income-credits');
    if (creditsEl) {
        creditsEl.textContent = 'Credits: ' + creditsText;
        creditsEl.classList.toggle('eco-negative', tempcredits < 0);
    }

    const foodEl = el('eco-income-food');
    if (foodEl) {
        if (food_button_text === 'No') {
            const val = options.turnfactor * (Math.floor(food_made) - Math.floor(totals.food_need_per));
            foodEl.textContent = 'Food ' + (val >= 0 ? '+' : '') + Commas(val);
            foodEl.classList.toggle('eco-negative', val < 0);
        } else {
            foodEl.textContent = 'Food +0';
            foodEl.classList.remove('eco-negative');
        }
    }

    const goodsEl = el('eco-income-goods');
    if (goodsEl) {
        if (goods_button_text === 'No') {
            const val = options.turnfactor * (Math.floor(goods_made) - Math.floor(totals.goods_need_per));
            goodsEl.textContent = 'Goods ' + (val >= 0 ? '+' : '') + Commas(val);
            goodsEl.classList.toggle('eco-negative', val < 0);
        } else {
            goodsEl.textContent = 'Goods +0';
            goodsEl.classList.remove('eco-negative');
        }
    }

    el('eco-income-minerals') && (el('eco-income-minerals').textContent = 'Minerals +' + Commas(minerals.total() * options.turnfactor));

    const perLandEl = el('eco-income-perland');
    if (perLandEl) {
        const val = infra_total > 0 ? Commas(Math.round((tempcredits / land_total) * 1000) / 1000) : 0;
        perLandEl.textContent = '$' + val + ' /land';
        perLandEl.classList.toggle('eco-negative', (Math.round((tempcredits / (infra_total || 1)) * 1000) / 1000) < 0);
    }
    const perPrEl = el('eco-income-perpr');
    if (perPrEl) {
        const val = infra_total > 0 ? Commas(Math.round((tempcredits / total_power_rating) * 1000) / 1000) : 0;
        perPrEl.textContent = '$' + val + ' /pr';
        perPrEl.classList.toggle('eco-negative', tempcredits / total_power_rating < 0);
    }
    const perPopEl = el('eco-income-perpop');
    if (perPopEl) {
        const val = infra_total > 0 ? Commas(Math.round((tempcredits / population_total) * 1000) / 1000) : 0;
        perPopEl.textContent = '$' + val + ' /pop';
        perPopEl.classList.toggle('eco-negative', (Math.round((tempcredits / (infra_total || 1)) * 1000) / 1000) < 0);
    }
}

function syncStaticControls() {
    el('eco-race-selector') && (el('eco-race-selector').value = String(selector));
    el('eco-housing') && (el('eco-housing').value = infra.housing);
    el('eco-commercial') && (el('eco-commercial').value = infra.commercial);
    el('eco-industry') && (el('eco-industry').value = infra.industry);
    el('eco-agriculture') && (el('eco-agriculture').value = infra.agriculture);
    el('eco-mining') && (el('eco-mining').value = infra.mining);
    el('eco-housing') && (el('eco-housing').max = 255 - infra.commercial - infra.industry - infra.agriculture - infra.mining);
    el('eco-commercial') && (el('eco-commercial').max = 255 - infra.housing - infra.industry - infra.agriculture - infra.mining);
    el('eco-industry') && (el('eco-industry').max = 255 - infra.commercial - infra.housing - infra.agriculture - infra.mining);
    el('eco-agriculture') && (el('eco-agriculture').max = 255 - infra.commercial - infra.industry - infra.housing - infra.mining);
    el('eco-mining') && (el('eco-mining').max = 255 - infra.commercial - infra.industry - infra.agriculture - infra.housing);

    el('eco-goods-toggle') && (el('eco-goods-toggle').textContent = goods_button_text);
    el('eco-food-toggle') && (el('eco-food-toggle').textContent = food_button_text);
    el('eco-rm-toggle') && (el('eco-rm-toggle').textContent = rm_button_text);
    el('eco-goods-price') && (el('eco-goods-price').value = goods_button_value);
    el('eco-food-price') && (el('eco-food-price').value = food_button_value);
    el('eco-rm-price') && (el('eco-rm-price').value = rm_button_value);

    el('eco-turnfactor') && (el('eco-turnfactor').value = options.turnfactor);

    const nextTurn = el('eco-turn-next');
    const totalTurn = el('eco-turn-total');
    if (nextTurn) nextTurn.textContent = 'Next: ' + Commas(infra_turns[infra.total()]);
    if (totalTurn) {
        let tempturn = 0;
        for (let t = infra.total() - 1; t > -1; t--) tempturn += parseInt(infra_turns[t]);
        totalTurn.textContent = 'Total: ' + Commas(tempturn);
    }
}

function applyOptionVisibility() {
    document.querySelectorAll('[data-toggle]').forEach((node) => {
        const key = node.dataset.toggle;
        node.hidden = options[key] !== 'Show';
    });
}

/* ============================================================
   Options panel
   ============================================================ */

function toggleRowHtml(key, label, mode) {
    const on = mode === 'yesno' ? options[key] === 'Yes' : options[key] === 'Show';
    return `
        <label class="toggle-row" data-option-row="${key}" data-mode="${mode}">
            <span class="toggle-label">${label}</span>
            <span class="switch"><input type="checkbox" data-option="${key}" data-mode="${mode}" ${on ? 'checked' : ''}><span class="slider"></span></span>
        </label>`;
}

function renderOptionsPanel() {
    el('eco-opt-sections').innerHTML = SECTION_TOGGLES.map(([k, l]) => toggleRowHtml(k, l, 'showhide')).join('');
    el('eco-opt-lines').innerHTML = LINE_TOGGLES.map(([k, l]) => toggleRowHtml(k, l, 'showhide')).join('');
    el('eco-opt-yesno').innerHTML = YESNO_TOGGLES.map(([k, l]) => toggleRowHtml(k, l, 'yesno')).join('');
    el('eco-opt-save').innerHTML = SAVE_TOGGLES.map(([k, l]) => toggleRowHtml(k, l, 'yesno')).join('');

    const hasSavedColony = localStorage.eco_colony && localStorage.eco_colony !== '{}';
    el('eco-load-saved').textContent = hasSavedColony ? 'Load' : 'No Save';
    el('eco-delete-saved').textContent = hasSavedColony ? 'Delete' : 'Empty';
}

function initOptionsPanel() {
    const overlay = el('eco-options-overlay');
    el('eco-options-btn').addEventListener('click', () => { renderOptionsPanel(); overlay.hidden = false; });
    el('eco-options-close').addEventListener('click', () => { overlay.hidden = true; });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.hidden = true; });

    overlay.addEventListener('change', (e) => {
        const toggle = e.target.closest('[data-option]');
        if (toggle) {
            const key = toggle.dataset.option;
            if (toggle.dataset.mode === 'yesno') {
                options[key] = toggle.checked ? 'Yes' : 'No';
            } else {
                options[key] = toggle.checked ? 'Show' : 'Hide';
            }
            applyOptionVisibility();
            return;
        }
    });

    el('eco-opt-reset').addEventListener('click', () => {
        options = Object.assign({}, RESET_OPTIONS);
        renderOptionsPanel();
        applyOptionVisibility();
    });

    el('eco-load-saved').addEventListener('click', () => {
        if (localStorage.eco_colony && localStorage.eco_colony !== '{}') {
            colony = JSON.parse(localStorage.eco_colony);
            number = JSON.parse(localStorage.eco_number);
            Create_Colony();
        }
    });

    el('eco-delete-saved').addEventListener('click', () => {
        if (localStorage.eco_colony && localStorage.eco_colony !== '{}') {
            localStorage.removeItem('eco_colony');
            localStorage.removeItem('eco_number');
        }
        renderOptionsPanel();
    });

    el('eco-paste').addEventListener('change', (e) => {
        pasteColonies(e.target.value);
    });
}

/* ============================================================
   Colony paste parser — ported verbatim from Colony_Paste()/Convert()
   ============================================================ */

function convertPaste(text) {
    const lines = text.replace(' ', ',').split('\n');
    return lines.map((line) => line.replace(/(\t(?=(?:(?:[^"]*"){2})*[^"]*$))/g, ',')).join('\n');
}

function pasteColonies(info) {
    let bah = info;
    bah = bah.replaceAll(/((?![\r\n])\s){2,}/g, "\t");
    bah = bah.replaceAll(/((?![\r])\s){2,}/g, "\t");
    bah = bah.replaceAll(/((?![\t\t])\s){2,}/g, "\t");
    bah = bah.replaceAll(/((?!\n)\s){2,}/g, "\t");
    bah = bah.replaceAll("Border Colony\t", "");
    bah = bah.replace(/U./g, "U_");
    bah = bah.replaceAll(/Cluster Lvl /g, "Cluster_Lvl_");
    bah = bah.replaceAll(/,/g, "");
    bah = bah.replace(/\ C\./g, "_C_");
    bah = bah.replace(/\ C/g, "_C_");
    bah = bah.replace(/(?:\b([\s]))/g, ",");
    bah = convertPaste(bah);
    let parts = bah.split(',', 100000);

    for (const num in parts) {
        if (parts[num] === "Mining") { parts.splice(0, num); parts.splice(0, 1); }
        if (parts[num] === "Total") { parts.splice(num, parts.length); }
        if (parts[num] === "") { parts.splice(num, 1); }
    }

    colony = [];
    const max = parts.length / 8;
    let num = 0;
    while (num < max) {
        const templand = (parseInt(parts[3 + (num * 8)]) || 0) + (parseInt(parts[4 + (num * 8)]) || 0) + (parseInt(parts[5 + (num * 8)]) || 0) + (parseInt(parts[6 + (num * 8)]) || 0) + (parseInt(parts[7 + (num * 8)]) || 0);
        colony[num] = {
            type: parts[1 + (num * 8)], land: templand, loyalty: 50, population: 0,
            housing_land: parseInt(parts[3 + (num * 8)]) || 0, commercial_land: parseInt(parts[4 + (num * 8)]) || 0,
            industry_land: parseInt(parts[5 + (num * 8)]) || 0, agriculture_land: parseInt(parts[6 + (num * 8)]) || 0,
            food_req: 0, goods_req: 0, food_produced: 0, goods_produced: 0, mineral_name: 'terran_metal',
            taxes_collected: 0, comm_collected: 0, agriculture_mod: 0, planets: 1, mining_mod: 0, pop_mod: 0,
            mining_land: parseInt(parts[7 + (num * 8)]) || 0, captured: "No", plunder_value: 0, useable: false, planets_modified: false
        };
        num++;
    }
    number = num;
    Create_Colony();
}

/* ============================================================
   Debounced recompute (matches original Keyer())
   ============================================================ */

function Keyer() {
    if (keyer_timeout) clearTimeout(keyer_timeout);
    key_count_global++;
    const thisCount = key_count_global;
    keyer_timeout = setTimeout(() => {
        if (thisCount === key_count_global) { key_count_global = 0; Create_Colony(); }
    }, 0);
}

/* ============================================================
   Static control wiring
   ============================================================ */

function initTopControls() {
    const raceSelect = el('eco-race-selector');
    Object.keys(races).forEach((k) => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = races[k].name;
        raceSelect.appendChild(opt);
    });
    raceSelect.value = String(selector);
    raceSelect.addEventListener('change', () => { selector = parseInt(raceSelect.value, 10); Create_Colony(); });

    el('eco-create-colony').addEventListener('click', () => Create_Colony(true));
    el('eco-clear-all').addEventListener('click', Clear);
    el('eco-view-toggle').addEventListener('click', () => {
        productionView = !productionView;
        el('eco-view-toggle').textContent = productionView ? 'Overview' : 'Production View';
        el('eco-colony-overview').hidden = productionView;
        el('eco-colony-production').hidden = !productionView;
    });

    el('eco-max-loyalty').addEventListener('click', () => applyEcon('Max Loyalty'));
    el('eco-min-loyalty').addEventListener('click', () => applyEcon('Min Loyalty'));
    el('eco-remove-infra').addEventListener('click', () => applyEcon('Clear'));

    document.querySelectorAll('[data-econ]').forEach((btn) => {
        btn.addEventListener('click', () => applyEcon(btn.dataset.econ));
    });

    ['housing', 'commercial', 'industry', 'agriculture', 'mining'].forEach((field) => {
        el(`eco-${field}`).addEventListener('change', (e) => {
            infra[field] = parseInt(e.target.value, 10) || 0;
            Keyer();
        });
    });

    el('eco-turnfactor').addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10) || 1;
        if (val <= 0) val = 1;
        if (val > 90) val = 90;
        options.turnfactor = val;
        Keyer();
    });

    el('eco-goods-toggle').addEventListener('click', (e) => { goods_button_text = goods_button_text === 'Yes' ? 'No' : 'Yes'; e.target.textContent = goods_button_text; Create_Colony(); });
    el('eco-food-toggle').addEventListener('click', (e) => { food_button_text = food_button_text === 'Yes' ? 'No' : 'Yes'; e.target.textContent = food_button_text; Create_Colony(); });
    el('eco-rm-toggle').addEventListener('click', (e) => { rm_button_text = rm_button_text === 'Yes' ? 'No' : 'Yes'; e.target.textContent = rm_button_text; Create_Colony(); });
    el('eco-goods-price').addEventListener('change', (e) => { goods_button_value = parseInt(e.target.value, 10) || 0; Keyer(); });
    el('eco-food-price').addEventListener('change', (e) => { food_button_value = parseInt(e.target.value, 10) || 0; Keyer(); });
    el('eco-rm-price').addEventListener('change', (e) => { rm_button_value = parseInt(e.target.value, 10) || 0; Keyer(); });

    el('eco-fleet-upkeep').addEventListener('change', (e) => { fleet_upkeep_value = parseInt(e.target.value, 10) || 0; Keyer(); });

    const mineralToggleState = {
        terran_metal: () => terran_metal_button_text, red_crystal: () => red_crystal_button_text, white_crystal: () => white_crystal_button_text,
        rutile: () => rutile_button_text, composite: () => composite_button_text, strafez_organism: () => strafez_organism_button_text
    };
    MINERAL_TYPES.forEach(([key]) => {
        el(`eco-mineral-toggle-${key}`).addEventListener('click', (e) => {
            const newVal = mineralToggleState[key]() === 'Yes' ? 'No' : 'Yes';
            switch (key) {
                case 'terran_metal': terran_metal_button_text = newVal; break;
                case 'red_crystal': red_crystal_button_text = newVal; break;
                case 'white_crystal': white_crystal_button_text = newVal; break;
                case 'rutile': rutile_button_text = newVal; break;
                case 'composite': composite_button_text = newVal; break;
                case 'strafez_organism': strafez_organism_button_text = newVal; break;
            }
            e.target.textContent = newVal;
            Create_Colony();
        });
        el(`eco-mineral-price-${key}`).addEventListener('change', (e) => {
            const val = parseInt(e.target.value, 10) || 0;
            switch (key) {
                case 'terran_metal': terran_metal_button_value = val; break;
                case 'red_crystal': red_crystal_button_value = val; break;
                case 'white_crystal': white_crystal_button_value = val; break;
                case 'rutile': rutile_button_value = val; break;
                case 'composite': composite_button_value = val; break;
                case 'strafez_organism': strafez_organism_button_value = val; break;
            }
            Keyer();
        });
    });
}

function initColonyTable() {
    const body = el('eco-colony-rows');
    body.addEventListener('change', (e) => {
        const input = e.target.closest('[data-field]');
        if (!input) return;
        const tr = input.closest('tr');
        const idx = tr.dataset.index;
        const c = colony[idx];
        if (!c) return;
        const field = input.dataset.field;
        if (field === 'type' || field === 'mineral_name') {
            c[field] = input.value;
        } else if (field === 'planets') {
            c.planets = parseInt(input.value, 10) || 0;
            c.planets_modified = true;
        } else if (field === 'population') {
            c.population = parseInt(input.value, 10) || 0;
        } else {
            c[field] = parseInt(input.value, 10) || 0;
        }
        Keyer();
    });

    body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const tr = btn.closest('tr');
        const idx = tr.dataset.index;
        if (btn.dataset.action === 'capture') {
            Capture_Switch(idx);
            Create_Colony();
        } else if (btn.dataset.action === 'remove') {
            delete colony[idx];
            Recombine_Colonies();
            Create_Colony();
        }
    });
}

function Clear() {
    minerals = freshMinerals();
    colony = [];
    fleet_upkeep_value = 0;
    infra = freshInfra();
    selector = 0;
    number = 0;
    terran_metal_button_text = "No"; red_crystal_button_text = "No"; white_crystal_button_text = "No";
    rutile_button_text = "No"; composite_button_text = "No"; strafez_organism_button_text = "No";
    terran_metal_button_value = 1000; red_crystal_button_value = 1000; white_crystal_button_value = 1000;
    rutile_button_value = 1000; composite_button_value = 1000; strafez_organism_button_value = 1000;
    food_button_text = "Yes"; goods_button_text = "Yes"; rm_button_text = "Yes";
    food_button_value = 8; goods_button_value = 4; rm_button_value = 1;
    el('eco-race-selector').value = '0';
    Create_Colony();
}

/* ============================================================
   Init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    Load();
    initTopControls();
    initColonyTable();
    initOptionsPanel();
    el('eco-view-toggle').textContent = 'Production View';
    Create_Colony();
});
