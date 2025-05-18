import { v4 as uuidv4 } from "uuid";

// Types
// export interface Company {
//   id: string;
//   companyId: string;
//   name: string;
//   phone: string;
//   email: string;
//   code: string;
// }
export interface Company {
  _id: string
  businessName: string
  identificationNumber: string
  businessLicenseNumber: string
  businessAddress: string
  businessEntity: string
  businessDuration: string
  industryType: string
  employeeNumber: number
  primaryProducts: string[]
  annualRevenue: number
  uniqueCode: string
  userId: string
  createdAt: string
  updatedAt: string
  __v: number
}


export interface Subscription {
  id: string;
  packageId: string;
  type: string;
  feature: string;
  amount: string;
  date: string;
  status: string;
}

export interface Payment {
  id: string;
  paymentId: string;
  amount: string;
  customerId: string;
  customerEmail: string;
  method: string;
  date: string;
  status: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

export interface PendingPayment {
  id: string;
  paymentId: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  method: string;
  amount: string;
  date: string;
  status: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalSubscriptions: number;
  pendingPaymentPercentage: number;
}

// Mock data
// const companies: Company[]  = Array.from({ length: 50 }, (_, i) => ({
//   id: uuidv4(),
//   companyId: `${
//     [
//       "KK6ZH8",
//       "X9G5N2",
//       "N8CZ7D",
//       "F5KZ4E",
//       "ZFJ8Y7",
//       "8XK9DY",
//       "KJ7H5B",
//       "E6JX9G",
//       "D4X6BC",
//       "4YEXBK",
//     ][i % 10]
//   }`,
//   name: `${
//     [
//       "Acme Co.",
//       "Barone LLC.",
//       "Binford Ltd.",
//       "Big Kahuna Burger Ltd.",
//       "Abstergo Ltd.",
//       "Biffco Enterprises Ltd.",
//     ][i % 6]
//   }`,
//   phone: `(${Math.floor(Math.random() * 900) + 100}) 555-${String(
//     Math.floor(Math.random() * 10000)
//   ).padStart(4, "0")}`,
//   email: `${
//     [
//       "ziar",
//       "joie",
//       "codence",
//       "xterris",
//       "dric",
//       "warn",
//       "redaniel",
//       "hamli",
//       "inabela",
//       "bertou",
//       "osgoodwy",
//       "ahana",
//       "icadahli",
//       "iline",
//       "cido",
//       "dowdy",
//       "kspiter",
//       "mobilelp",
//       "webdragon",
//       "grossman",
//     ][i % 20]
//   }@${
//     [
//       "gmail.com",
//       "yahoo.com",
//       "mail.ru",
//       "yandex.ru",
//       "live.com",
//       "msn.com",
//       "mac.com",
//     ][i % 7]
//   }`,
//   code: `${Math.floor(Math.random() * 90000) + 10000}`,
// }));

const subscriptions: Subscription[] = Array.from({ length: 50 }, (_, i) => ({
  id: uuidv4(),
  packageId: `#PAY-${2025000 + i}`,
  type: i % 5 === 0 ? "Team" : "Individual",
  feature:
    i % 5 === 0
      ? "Market Growth Solution\nGreat Customer Support"
      : "Market Growth Solution\nTime Series Models",
  amount: "$400.00",
  date: `Mar ${15 + (i % 15)}, 2025`,
  status: "Active",
}));

const payments: Payment[] = Array.from({ length: 50 }, (_, i) => ({
  id: uuidv4(),
  paymentId: `#PAY-${2025000 + i}`,
  amount: `$${Math.floor(Math.random() * 500) + 100}.00`,
  customerId: `#PAY-${2025000 + i}`,
  customerEmail: `customer${i}@gmail.com`,
  method: i % 4 === 0 ? "Visa" : "PayPal",
  date: `Mar ${15 + (i % 15)}, 2025`,
  status: i % 4 === 0 ? "Paid" : "Due",
}));

const blogs: Blog[] = Array.from({ length: 30 }, (_, i) => ({
  id: uuidv4(),
  title: `How to improve employees skill ${i + 1}`,
  description: `Lorem ipsum dolor sit amet consectetur. Gravida in quis neque maecenas egestas iaculis. Mattis in feugiat sed eu eu nulla amet suscipit quam. Senectus nulla lectus urna blandit varius vitae eliquet nec rhoncus. Tempus sed pellentesque massa ut nisl hac neque.Lorem ipsum dolor sit amet consectetur. Gravida in quis neque maecenas egestas iaculis. Mattis in feugiat sed eu eu nulla amet suscipit quam. Senectus nulla lectus urna blandit varius vitae eliquet nec rhoncus. Tempus sed pellentesque massa ut nisl hac neque.Lorem ipsum dolor sit amet consectetur. Gravida in quis neque maecenas egestas iaculis. Mattis in feugiat sed eu eu nulla amet suscipit quam. Senectus nulla lectus urna blandit varius vitae eliquet nec rhoncus. Tempus sed pellentesque massa ut nisl hac neque.`,
  author: "Admin",
  date: `March ${10 + (i % 20)}, 2025`,
  image: i % 3 === 0 ? "/placeholder.svg?height=400&width=600" : undefined,
}));

const notifications: Notification[] = Array.from({ length: 40 }, (_, i) => ({
  id: uuidv4(),
  title: [
    "New payment received",
    "Subscription renewed",
    "New customer registered",
    "Payment overdue",
    "System update completed",
    "Security alert",
    "New blog published",
    "Customer feedback received",
  ][i % 8],
  description: [
    `You have received a new payment of $${
      Math.floor(Math.random() * 500) + 100
    }.00 from Sarah Wilson`,
    "A customer has renewed their subscription plan",
    "A new customer has registered on the platform",
    "A payment is overdue and requires attention",
    "The system has been updated to the latest version",
    "Unusual login activity detected on your account",
    "A new blog post has been published on the website",
    "A customer has left feedback on their recent purchase",
  ][i % 8],
  date: `March ${10 + (i % 20)}, 2025`,
  read: i % 3 === 0,
}));

const pendingPayments: PendingPayment[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: uuidv4(),
    paymentId: `#PAY-${2025000 + i}`,
    user: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/placeholder-user.jpg",
    },
    method: i % 4 === 0 ? "Visa" : "PayPal",
    amount: `$${299 + (i % 3) * 50}.00`,
    date: `Mar ${15 + (i % 15)}, 2025`,
    status: "Pending",
  })
);

// API service functions
export const apiService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        totalRevenue: 90225,
        totalCustomers: 50225,
        totalSubscriptions: 10,
        pendingPaymentPercentage: 40.76,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard stats");
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserGrowthData: async (period: string): Promise<any[]> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: Record<string, any[]> = {
        "12months": [
          { name: "Jan", value: 30000 },
          { name: "Feb", value: 32000 },
          { name: "Mar", value: 31000 },
          { name: "Apr", value: 33000 },
          { name: "May", value: 35000 },
          { name: "Jun", value: 45591 },
          { name: "Jul", value: 37000 },
          { name: "Aug", value: 39000 },
          { name: "Sep", value: 40000 },
          { name: "Oct", value: 42000 },
          { name: "Nov", value: 43000 },
          { name: "Dec", value: 45000 },
        ],
        "6months": [
          { name: "Jan", value: 35000 },
          { name: "Feb", value: 37000 },
          { name: "Mar", value: 39000 },
          { name: "Apr", value: 41000 },
          { name: "May", value: 43000 },
          { name: "Jun", value: 45591 },
        ],
        "30days": Array.from({ length: 30 }, (_, i) => ({
          name: `${i + 1}`,
          value: 40000 + Math.floor(Math.random() * 5000),
        })),
        "7days": Array.from({ length: 7 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: 43000 + Math.floor(Math.random() * 3000),
        })),
      };

      return data[period] || data["12months"];
    } catch (error) {
      console.error("Error fetching user growth data:", error);
      throw new Error("Failed to fetch user growth data");
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCarbonEmissionsData: async (): Promise<any[]> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        { name: "Transport", value: 50, color: "#09B850" },
        { name: "Manufacturing", value: 10, color: "#4285F4" },
        { name: "Electricity", value: 5, color: "#5E35B1" },
        { name: "Waste Management", value: 15, color: "#F4B400" },
        { name: "Others", value: 20, color: "#FFD600" },
      ];
    } catch (error) {
      console.error("Error fetching carbon emissions data:", error);
      throw new Error("Failed to fetch carbon emissions data");
    }
  },

  // Companies
  // getCompanies: async (
  //   page = 1,
  //   limit = 10,
  //   search = ""
  // ): Promise<{ data: Company[]; total: number }> => {
  //   try {
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     let filteredCompanies = [...companies];

  //     if (search) {
  //       const searchLower = search.toLowerCase();
  //       filteredCompanies = filteredCompanies.filter(
  //         (company) =>
  //           company.name.toLowerCase().includes(searchLower) ||
  //           company.email.toLowerCase().includes(searchLower) ||
  //           company.companyId.toLowerCase().includes(searchLower) ||
  //           company.code.toLowerCase().includes(searchLower)
  //       );
  //     }

  //     const start = (page - 1) * limit;
  //     const end = start + limit;

  //     return {
  //       data: filteredCompanies.slice(start, end),
  //       total: filteredCompanies.length,
  //     };
  //   } catch (error) {
  //     console.error("Error fetching companies:", error);
  //     throw new Error("Failed to fetch companies");
  //   }
  // },

  // getCompanyById: async (id: string): Promise<Company | null> => {
  //   try {
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     return companies.find((company) => company.id === id) || null;
  //   } catch (error) {
  //     console.error("Error fetching company by ID:", error);
  //     throw new Error("Failed to fetch company by ID");
  //   }
  // },

  // createCompany: async (company: Omit<Company, "id">): Promise<Company> => {
  //   try {
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 800));

  //     const newCompany = {
  //       id: uuidv4(),
  //       ...company,
  //     };

  //     companies.unshift(newCompany);

  //     return newCompany;
  //   } catch (error) {
  //     console.error("Error creating company:", error);
  //     throw new Error("Failed to create company");
  //   }
  // },

  // updateCompany: async (
  //   id: string,
  //   company: Partial<Company>
  // ): Promise<Company | null> => {
  //   try {
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 800));

  //     const index = companies.findIndex((c) => c.id === id);

  //     if (index === -1) return null;

  //     const updatedCompany = {
  //       ...companies[index],
  //       ...company,
  //     };

  //     companies[index] = updatedCompany;

  //     return updatedCompany;
  //   } catch (error) {
  //     console.error("Error updating company:", error);
  //     throw new Error("Failed to update company");
  //   }
  // },

  // deleteCompany: async (id: string): Promise<boolean> => {
  //   try {
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 800));

  //     const index = companies.findIndex((c) => c.id === id);

  //     if (index === -1) return false;

  //     companies.splice(index, 1);

  //     return true;
  //   } catch (error) {
  //     console.error("Error deleting company:", error);
  //     return false;
  //   }
  // },

  // Subscriptions
  getSubscriptions: async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<{ data: Subscription[]; total: number }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredSubscriptions = [...subscriptions];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredSubscriptions = filteredSubscriptions.filter(
          (subscription) =>
            subscription.packageId.toLowerCase().includes(searchLower) ||
            subscription.type.toLowerCase().includes(searchLower) ||
            subscription.feature.toLowerCase().includes(searchLower)
        );
      }

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        data: filteredSubscriptions.slice(start, end),
        total: filteredSubscriptions.length,
      };
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw new Error("Failed to fetch subscriptions");
    }
  },

  getSubscriptionById: async (id: string): Promise<Subscription | null> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return (
        subscriptions.find((subscription) => subscription.id === id) || null
      );
    } catch (error) {
      console.error("Error fetching subscription by ID:", error);
      throw new Error("Failed to fetch subscription by ID");
    }
  },

  createSubscription: async (
    subscription: Omit<Subscription, "id">
  ): Promise<Subscription> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newSubscription = {
        id: uuidv4(),
        ...subscription,
      };

      subscriptions.unshift(newSubscription);

      return newSubscription;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new Error("Failed to create subscription");
    }
  },

  updateSubscription: async (
    id: string,
    subscription: Partial<Subscription>
  ): Promise<Subscription | null> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = subscriptions.findIndex((s) => s.id === id);

      if (index === -1) return null;

      const updatedSubscription = {
        ...subscriptions[index],
        ...subscription,
      };

      subscriptions[index] = updatedSubscription;

      return updatedSubscription;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new Error("Failed to update subscription");
    }
  },

  deleteSubscription: async (id: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = subscriptions.findIndex((s) => s.id === id);

      if (index === -1) return false;

      subscriptions.splice(index, 1);

      return true;
    } catch (error) {
      console.error("Error deleting subscription:", error);
      return false;
    }
  },

  // Payments
  getPayments: async (
    page = 1,
    limit = 10,
    filters: {
      fromDate?: string;
      toDate?: string;
      method?: string;
      status?: string;
      search?: string;
    } = {}
  ): Promise<{ data: Payment[]; total: number }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredPayments = [...payments];

      if (filters.fromDate) {
        // Simple date filtering for demo
        filteredPayments = filteredPayments.filter(
          (payment) => payment.date >= filters.fromDate!
        );
      }

      if (filters.toDate) {
        // Simple date filtering for demo
        filteredPayments = filteredPayments.filter(
          (payment) => payment.date <= filters.toDate!
        );
      }

      if (filters.method && filters.method !== "All Methods") {
        filteredPayments = filteredPayments.filter(
          (payment) => payment.method === filters.method
        );
      }

      if (filters.status && filters.status !== "All") {
        filteredPayments = filteredPayments.filter(
          (payment) => payment.status === filters.status
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPayments = filteredPayments.filter(
          (payment) =>
            payment.paymentId.toLowerCase().includes(searchLower) ||
            payment.customerEmail.toLowerCase().includes(searchLower) ||
            payment.amount.toLowerCase().includes(searchLower)
        );
      }

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        data: filteredPayments.slice(start, end),
        total: filteredPayments.length,
      };
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw new Error("Failed to fetch payments");
    }
  },

  // Blogs
  getBlogs: async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<{ data: Blog[]; total: number }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredBlogs = [...blogs];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredBlogs = filteredBlogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(searchLower) ||
            blog.description.toLowerCase().includes(searchLower) ||
            blog.author.toLowerCase().includes(searchLower)
        );
      }

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        data: filteredBlogs.slice(start, end),
        total: filteredBlogs.length,
      };
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new Error("Failed to fetch blogs");
    }
  },

  getBlogById: async (id: string): Promise<Blog | null> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return blogs.find((blog) => blog.id === id) || null;
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      throw new Error("Failed to fetch blog by ID");
    }
  },

  createBlog: async (blog: Omit<Blog, "id">): Promise<Blog> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newBlog = {
        id: uuidv4(),
        ...blog,
      };

      blogs.unshift(newBlog);

      return newBlog;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new Error("Failed to create blog");
    }
  },

  updateBlog: async (id: string, blog: Partial<Blog>): Promise<Blog | null> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = blogs.findIndex((b) => b.id === id);

      if (index === -1) return null;

      const updatedBlog = {
        ...blogs[index],
        ...blog,
      };

      blogs[index] = updatedBlog;

      return updatedBlog;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw new Error("Failed to update blog");
    }
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = blogs.findIndex((b) => b.id === id);

      if (index === -1) return false;

      blogs.splice(index, 1);

      return true;
    } catch (error) {
      console.error("Error deleting blog:", error);
      return false;
    }
  },

  // Notifications
  getNotifications: async (
    page = 1,
    limit = 10
  ): Promise<{ data: Notification[]; total: number }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        data: notifications.slice(start, end),
        total: notifications.length,
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  },

  markNotificationAsRead: async (id: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const notification = notifications.find((n) => n.id === id);

      if (!notification) return false;

      notification.read = true;

      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  },

  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = notifications.findIndex((n) => n.id === id);

      if (index === -1) return false;

      notifications.splice(index, 1);

      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  },

  clearAllNotifications: async (): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      notifications.length = 0;

      return true;
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      return false;
    }
  },

  // Pending Payments
  getPendingPayments: async (
    page = 1,
    limit = 10,
    filters: {
      fromDate?: string;
      toDate?: string;
      method?: string;
      amountRange?: string;
      search?: string;
    } = {}
  ): Promise<{ data: PendingPayment[]; total: number }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredPayments = [...pendingPayments];

      if (filters.fromDate) {
        // Simple date filtering for demo
        filteredPayments = filteredPayments.filter(
          (payment) => payment.date >= filters.fromDate!
        );
      }

      if (filters.toDate) {
        // Simple date filtering for demo
        filteredPayments = filteredPayments.filter(
          (payment) => payment.date <= filters.toDate!
        );
      }

      if (filters.method && filters.method !== "All Methods") {
        filteredPayments = filteredPayments.filter(
          (payment) => payment.method === filters.method
        );
      }

      if (filters.amountRange && filters.amountRange !== "All Amounts") {
        // Parse amount range like "$0 - $100"
        const [min, max] = filters.amountRange
          .split(" - ")
          .map((a) => Number.parseInt(a.replace(/[^0-9]/g, "")));

        filteredPayments = filteredPayments.filter((payment) => {
          const amount = Number.parseInt(payment.amount.replace(/[^0-9]/g, ""));
          return amount >= min && amount <= max;
        });
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPayments = filteredPayments.filter(
          (payment) =>
            payment.paymentId.toLowerCase().includes(searchLower) ||
            payment.user.name.toLowerCase().includes(searchLower) ||
            payment.user.email.toLowerCase().includes(searchLower) ||
            payment.amount.toLowerCase().includes(searchLower)
        );
      }

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        data: filteredPayments.slice(start, end),
        total: filteredPayments.length,
      };
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      throw new Error("Failed to fetch pending payments");
    }
  },

  // Auth
  login: async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user?: { name: string; email: string; role: string };
  }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple mock login
      if (email && password) {
        return {
          success: true,
          user: {
            name: "Rocks",
            email: email,
            role: "Admin",
          },
        };
      }

      return { success: false };
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Login failed");
    }
  },

  logout: async (): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  },
};
