import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

import { UserProfile } from '../types';

interface AuthContextType {
    currentUser: User | null;
    profile: UserProfile | null;
    userRole: 'buyer' | 'dealer' | 'admin' | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userRole, setUserRole] = useState<'buyer' | 'dealer' | 'admin' | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data() as UserProfile;
                setProfile(data);
                setUserRole(data.role || 'buyer');
            } else {
                setProfile(null);
                setUserRole('buyer');
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setProfile(null);
            setUserRole(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                await fetchProfile(user.uid);
            } else {
                setProfile(null);
                setUserRole(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = () => {
        return firebaseSignOut(auth);
    };

    const refreshProfile = async () => {
        if (currentUser) {
            await fetchProfile(currentUser.uid);
        }
    };

    const value = {
        currentUser,
        profile,
        userRole,
        loading,
        logout,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
