import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Represents the database schema for the Weddings & Events Luxembourg project.
 * This file defines all the tables, their columns, and basic relationships
 * using Drizzle ORM for MySQL.
 */

// --- AUTHENTICATION ---

/**
 * Core `users` table.
 * Stores essential user information for authentication and authorization.
 * This table is central to the application's security and user management.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(), // Unique identifier from an OAuth provider.
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }), // e.g., 'google', 'manus'.
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// --- PORTFOLIO ---

/**
 * `portfolio_categories` table.
 * Defines the categories for organizing portfolio projects, such as "Weddings", 
 * "Corporate Events", or "Private Celebrations".
 */
export const portfolioCategories = mysqlTable("portfolio_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // The display name of the category.
  slug: varchar("slug", { length: 100 }).notNull().unique(), // URL-friendly identifier.
  description: text("description"),
  displayOrder: int("displayOrder").default(0).notNull(), // To control the order in which categories appear.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * `portfolio_projects` table.
 * Stores individual portfolio entries, linking them to a category.
 * Each project represents a specific event or photoshoot.
 */
export const portfolioProjects = mysqlTable("portfolio_projects", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(), // Foreign key to `portfolio_categories`.
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 200 }),
  eventDate: timestamp("eventDate"),
  coverImageUrl: text("coverImageUrl").notNull(),
  imageUrls: text("imageUrls").notNull(), // Stored as a JSON string array of image URLs.
  featured: int("featured").default(0).notNull(), // Boolean flag (0 or 1) to feature a project on the homepage.
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// --- SERVICES & INQUIRIES ---

/**
 * `service_packages` table.
 * Defines the different service packages offered, e.g., Photography, Videography.
 */
export const servicePackages = mysqlTable("service_packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description").notNull(),
  features: text("features").notNull(), // Stored as a JSON string array of package features.
  price: decimal("price", { precision: 10, scale: 2 }), // The numerical price, if applicable.
  priceLabel: varchar("priceLabel", { length: 100 }), // A display label for the price, e.g., "Starting from", "Custom Quote".
  popular: int("popular").default(0).notNull(), // Boolean flag (0 or 1) to mark a package as popular.
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * `client_inquiries` table.
 * Stores submissions from the contact/inquiry form. This is a crucial table for lead management.
 */
export const clientInquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  event_type: varchar("event_type", { length: 100 }).notNull(), // e.g., Wedding, Corporate, Celebration.
  event_date: timestamp("event_date"),
  location: varchar("location", { length: 300 }),
  budget: varchar("budget", { length: 100 }),
  guest_count: int("guest_count"),
  service_interest: varchar("service_interest", { length: 200 }), // e.g., Photography, Video, Both.
  message: text("message"),
  status: mysqlEnum("status", ["new", "contacted", "quoted", "booked", "completed", "cancelled"]).default("new").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// --- WEBSITE CONTENT ---

/**
 * `team_members` table.
 * Stores information about the company's team members for the 'About Us' page.
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 150 }).notNull(), // e.g., 'Lead Photographer', 'Creative Director'.
  bio: text("bio"),
  imageUrl: text("imageUrl"),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// --- TYPE DEFINITIONS ---
// Exporting TypeScript types for use in the application.

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PortfolioCategory = typeof portfolioCategories.$inferSelect;
export type InsertPortfolioCategory = typeof portfolioCategories.$inferInsert;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = typeof portfolioProjects.$inferInsert;
export type ServicePackage = typeof servicePackages.$inferSelect;
export type InsertServicePackage = typeof servicePackages.$inferInsert;
export type ClientInquiry = typeof clientInquiries.$inferSelect;
export type InsertClientInquiry = typeof clientInquiries.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
