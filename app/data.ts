////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type TopicMutation = {
  id?: string;
  title?: string;
  description: string,
  content: string,
  
};

export type TopicRecord = TopicMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeTopics = {
  records: {} as Record<string, TopicRecord>,

  async getAll(): Promise<TopicRecord[]> {
    return Object.keys(fakeTopics.records)
      .map((key) => fakeTopics.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<TopicRecord | null> {
    return fakeTopics.records[id] || null;
  },

  async create(values: TopicMutation): Promise<TopicRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newTopic = { id, createdAt, ...values };
    fakeTopics.records[id] = newTopic;
    return newTopic;
  },

  async set(id: string, values: TopicMutation): Promise<TopicRecord> {
    const topic = await fakeTopics.get(id);
    invariant(topic, `No topic found for ${id}`);
    const updatedTopic = { ...topic, ...values };
    fakeTopics.records[id] = updatedTopic;
    return updatedTopic;
  },

  destroy(id: string): null {
    delete fakeTopics.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getTopics(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let topics = await fakeTopics.getAll();
  if (query) {
    topics = matchSorter(topics, query, {
      keys: ["title"],
    });
  }
  return topics.sort(sortBy("title", "createdAt"));
}

export async function createEmptyTopic() {
  const topic = await fakeTopics.create({
    description: "",
    content: ""
  });
  return topic;
}

export async function getTopic(id: string) {
  return fakeTopics.get(id);
}

export async function updateTopic(id: string, updates: TopicMutation) {
  const topic = await fakeTopics.get(id);
  if (!topic) {
    throw new Error(`No topic found for ${id}`);
  }
  await fakeTopics.set(id, { ...topic, ...updates });
  return topic;
}

export async function deleteTopic(id: string) {
  fakeTopics.destroy(id);
}

[

    {
        id: 1,
        title: "Chemical equations",
        content: "",
        description: `
               A chemical reaction is described by a chemical equation, an expression that gives
                the identities and quantities of the substances involved in a reaction. A chemical
                 equation shows the starting compound(s)—the reactants—on the left and the final 
                 compound(s)—the products—on the right, separated by an arrow
        `
    },
    {
        id: 2,
        title: "Stoichiometry",
        content: "Mole Concept, Molar Mass",
        description: `
                Stoichiometry is the calculation of reactants and products in 
                chemical reactions. This topic includes balancing chemical equations,
                 understanding mole ratios, and using conversions between moles, grams, and 
                 molecules to predict the outcomes of reactions.
        `
    },
    {
        id: 3,
        title: "Chemical Bonding",
        content: "Ionic Bonds, Covalent Bonds, Metallic Bonds",
        description: `
              Chemical bonding involves the interactions between atoms that 
              lead to the formation of compounds. This topic explores ionic, 
              covalent, and metallic bonds, along with concepts 
              like electronegativity, bond polarity, and molecular geometry.
        `
    },
    {
        id: 4,
        title: "Atomic Structure",
        content: "Atoms, Elements",
        description: `
              This topic covers the basic building blocks of matter, including 
              the structure of atoms, the role of protons, neutrons, and electrons, and how these particles contribute
               to the properties of elements. It also includes concepts like isotopes and atomic mass.
        `
    },
    {
        id: 5,
        title: "Equilibrium",
        content: "Modeling and simulation",
        description: `
              Chemical equilibrium is the state in which the rates of the forward and 
              reverse reactions are equal, resulting in stable concentrations of reactants 
              and products. This topic covers Le Chatelier's principle, equilibrium constants, 
              and the implications of shifts in equilibrium conditions.
        `
    }
  
].forEach((copic) => {
  fakeTopics.create({
    ...copic,
    id: `${copic.title.toLowerCase()}`,
  });
});
