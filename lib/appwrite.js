import {
  ID,
  Client,
  Account,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.meh.aora",
  projectId: "66c70e8800077d88b9ef",
  databaseId: "66c70ff5001cb7a40373",
  userCollectionId: "66c710240005a1dcf177",
  videoCollectionId: "66c71039002a1798def2",
  storageId: "66c711b60039b754f39c",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

// Register User
const account = new Account(client);
const avatars = new Avatars(client);

const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique().toString().substring(0, 36),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique().toString().substring(0, 36),
      {
        accountId: newAccount.$id,
        avatar: avatarUrl,
        email,
        username,
      }
    );
    // console.log("NEW USER ");

    // console.log(newUser);

    return newUser;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const useExistingSession = async () => {
  try {
    // Check if there is already an active session
    const currentSession = await account.getSession("current");
    if (currentSession) {
      return currentSession; // Return the existing session
    }
    return null; // Return null if no session is found
  } catch (error) {
    console.log("Error checking for active session:", error);
    return null; // Return null in case of any error (e.g., no session)
  }
};

export const signIn = async (email, password) => {
  const existingSession = await useExistingSession();
  if (existingSession) {
    return existingSession; // Return the existing session if it exists
  }
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (err) {
    throw new Error(err);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.getSession("current");
    // console.log(currentAccount);

    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.userId)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);
    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(5)),
    ]);
    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);
    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session
  } catch (error) {
    throw new Error(error);
  }
};
