import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api/auth";
import { CardMotion } from "../components/Card"; import { Skeleton } from "@/components/ui/skeleton";
;

export const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            await apiRegister({ name, email, password, confirmPassword });
            // Optionally show a success message
            navigate("/login");
        } catch (err) {
            setError("Registration failed. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <CardMotion className="p-8 w-full max-w-sm space-y-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-3/4 mx-auto" />
                        <div className="space-y-4">
                            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-full" /></div>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-5 w-3/4 mx-auto" />
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center">Register</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input id="password" type="password" value={password} required onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input id="confirmPassword" type="password" value={confirmPassword} required onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                                Register
                            </button>
                            <div className="text-sm text-center">
                                <p className="text-gray-600">Already have an account?{' '}<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link></p>
                            </div>
                        </form>
                    </>
                )}
            </CardMotion>
        </div>
    );
};