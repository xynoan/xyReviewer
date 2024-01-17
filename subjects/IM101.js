const enumeration = "(i.e. Item1, Item2)";

module.exports = {
  // WEEK 2 - REVIEW OF DATABASE CONCEPTS
  "A set of interrelated components that collect, manipulate, and disseminate data and information, and provide feedback to meet an objective.":
    "Information System",
  [`Enumerate 6 components of information system. ${enumeration}`]:
    "Data, Hardware, Software, Telecommunication, People, Procedures",
  [`Enumerate 5 stages of processing. ${enumeration}`]:
    "Input, Transaction, Data processing, Output, Storage",
  "Collect and introduce data to system.": "Input",
  "A business event, usually entered as input.": "Transaction",
  "Perform calculations on input.": "Data processing",
  "What is produced by the information system.": "Output",
  "Vast amounts of data stored on optical discs.": "Storage",
  "Stored representations of meaningful objects and events.": "Data",
  "Numbers, text, dates.": "Structured",
  "Images, video, documents.": "Unstructured",
  "Data processed to increase knowledge in the person using the data.":
    "Information",
  "Data that describes the properties and context of user data.": "Metadata",
  "Refers to an organization of components that define and regulate the collection, storage, management and use of data within a database environment.":
    "Database System",
  [`Enumerate 5 major parts of the database system. ${enumeration}`]:
    "Hardware, Software, People, Procedures, Data",
  "A collection of concepts that can be used to describe the structure of a database that provides the necessary means to achieve this abstraction.":
    "Data Models",
  [`Enumerate 3 basic building blocks of data models. ${enumeration}`]:
    "Entity, Attribute, Relationship",
  "Is a person, place, thing, or event about which data will be collected and stored.":
    "Entity",
  "Is a characteristic of an entity.": "Attribute",
  "Describes an association among entities.": "Relationship",
  [`Enumerate 3 types of relationship. ${enumeration}`]:
    "One-to-many, Many-to-many, One-to-one",
  "One entity instance is associated with many instances of the related entity.":
    "One-to-many",
  "Entity is associated with many occurrences of a related entity and one occurrence of the related entity is associated with many occurrences of the first entity.":
    "Many-to-many",
  "One entity instance is associated with only one instance of the related entity.":
    "One-to-one",
  [`Enumerate 3 categories of data model. ${enumeration}`]:
    "High-level or conceptual, Representational or logical, Low-level or physical",
  "Provide concepts that are close to the way many users perceive data.":
    "High-level or conceptual data model",
  "Provide concepts that may be understood by end users but that, are not too far removed from the way data is organized within the computer.":
    "Representational or logical data model",
  "Provide concepts that describe the details of how data is stored in the computer.":
    "Low-level or physical data model",
  [`Enumerate 3 designs of data model. ${enumeration}`]:
    "Conceptual, Logical, Physical",
  "Creating an Entity-Relationship Diagram (ERD) and associated data dictionary to represent the reality and capture business data requirements.":
    "Conceptual Design",
  "Transforming ERD to relational model: Tables, keys (constraints), etc.":
    "Logical Design",
  "Creating the database and other supporting structures based on a specific DBMS.":
    "Physical Design",
  "• Statements that define or constrain some aspect of the business.\n• Properly written business rules are used to define entities, attributes, relationships and constraints.\n• A description of a policy, procedure, or principle within an organization.\n• Assert business structure.\n• Control/influence business behavior.\n• Expressed in terms familiar to end users.\n• Automated through DBMS software.":
    "Business Rule",
  "• It helps to standardize the company’s view of data.\n• It can be a communication tool between users and designers.\n• It allows the designer to understand the nature, role, and scope of the data.\n• It allows the designer to understand business processes.\n• It allows the designer to develop appropriate relationship participation rules and constraints and to create an accurate data model.": 
  "Importance of Business Rule",
  [`Enumerate 7 of what makes a good business rule. ${enumeration}`]: 
  "Declarative, Precise, Atomic, Consistent, Expressible, Distinct, Business-oriented",
  "What, not how.": "Declarative",
  "Clear, agreed-upon meaning.": "Precise",
  "One statement.": "Atomic",
  "Internally and externally.": "Consistent",
  "Structured, natural language.": "Expressible",
  "Non-redundant.": "Distinct",
  "Understood by business people.": "Business-oriented",
  "Creates a graphical representation of the entities, and the relationships between entities, within an information system.": 
  "Data modeling technique",
  [`Enumerate 3 basic elements in ER models. ${enumeration}`]: "Entity, Attribute, Relationship",
  "- are the \"things\" about which we seek information.\n- is a person, object, place or event for which data is collected.": 
  "Entity",
  "- are the data we collect about the entities.": "Attribute",
  "- provide the structure needed to draw information from multiple entities or the link between entities.": 
  "Relationship",
  "May be an object with a physical existence (for example, a particular person, car, house, or employee) or it may be an object with a conceptual existence.": 
  "Entity",
  "Particular properties that describe it.": "Attribute",
  "Provide the structure needed to draw information from multiple entities or the link between entities.": "Relationship",
  [`Enumerate 7 types of attributes. ${enumeration}`]: 
  "Key, Composite, Required, Optional, Single-valued, Multi-valued, Derived",
  "Is the unique, distinguishing characteristic of the entity.": "Key Attribute",
  "Can be divided into smaller subparts, which represent more basic attributes with independent meanings.": 
  "Composite Attribute",
  "Is an attribute that must have a value; in other words, it cannot be left empty.": "Required Attribute",
  "Is an attribute that does not require a value; therefore, it can be left empty.": "Optional Attribute",
  "Is an attribute that can have only a single value.": "Single-valued Attribute",
  "Can have more than one value.": "Multi-valued Attribute",
  "Is an attribute whose value is calculated (derived) from other attributes.": "Derived Attribute",
  "Is the number of entity types that participate in it.": "Degree of Relationship",
  [`Enumerate 4 degrees of relationship. ${enumeration}`]: "Unary, Binary, Ternary, N'ary",
  "One entity related to another of the same entity type.": "Unary Relationship",
  "Entities of two different types related to each other.": "Binary Relationship",
  "Entities of three different types related to each other.": "Ternary Relationship",
  "Entities of three or more different types related to each other.": "N'ary Relationship",
  "Describes how many entity instance can be in the relationship.": "Cardinality of Relationship",
  [`Enumerate 3 cardinality of relationships. ${enumeration}`]: "One-to-many, Many-to-many, One-to-one",
  // WEEK 3
};
