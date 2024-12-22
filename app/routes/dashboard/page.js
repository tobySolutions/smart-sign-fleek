"use client";

import { useState, useEffect } from "react";
import {
  MenuIcon,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Settings,
  HelpCircle,
  Crown,
  User,
  LogOut,
} from "lucide-react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import ContractList from "@/app/components/dashboard/ContractList";
import ContractViewer from "@/app/components/dashboard/ContractViewer";
import NewContractModal from "@/app/components/dashboard/NewContractModal";
import PDFUploader from "@/app/components/dashboard/PDFUploader";
import { contractTemplates } from "@/app/data/contractTemplates";
import Link from "next/link";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New contract awaiting review",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      text: "Contract #123 has been signed",
      time: "1h ago",
      unread: true,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartFromTemplate = (template) => {
    setIsNewContractModalOpen(true);
  };

  const filteredTemplates = contractTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const userMenu = [
    { icon: <User className="h-4 w-4" />, label: "Profile Settings" },
    { icon: <Settings className="h-4 w-4" />, label: "Preferences" },
    { icon: <HelpCircle className="h-4 w-4" />, label: "Help Center" },
    { icon: <LogOut className="h-4 w-4" />, label: "Sign Out" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <MenuIcon className="h-6 w-6 text-gray-700" />
          </button>
          <div className="flex items-center ml-4">
            <Crown className="h-6 w-6 text-black" />
            <Link href="/" className="text-xl font-bold ml-2">
              SmartSignGPT
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search templates, contracts, or recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
            />
            <Search className="h-5 w-5 text-gray-500 absolute left-3 top-2.5 group-focus-within:text-black transition-colors duration-200" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 flex items-start ${
                      notification.unread ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          notification.unread ? "font-medium" : ""
                        }`}
                      >
                        {notification.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full mt-1"></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center font-medium">
                JD
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showUserMenu ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
                {userMenu.map((item, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div
          className={`transition-all duration-200 ease-in-out ${
            sidebarOpen ? "w-64" : "w-0"
          }`}
        >
          {sidebarOpen && (
            <Sidebar
              onNewContract={() => setIsNewContractModalOpen(true)}
              selectedTemplate={selectedTemplate}
            />
          )}
        </div>

        <div className="flex-1 flex">
          <ContractList
            templates={filteredTemplates}
            onSelectTemplate={setSelectedTemplate}
            className="w-80 overflow-y-auto bg-white border-r"
          />

          <div className="flex-1">
            {/* {showPDFUploader ? (
              <div className="h-full bg-white p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Upload Contract for Analysis</h2>
                  <button 
                    onClick={() => setShowPDFUploader(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
                <PDFUploader />
              </div>
            ) : (
              <ContractViewer 
                template={selectedTemplate}
                onStartFromTemplate={handleStartFromTemplate}
                className="h-full bg-white"
              />
            )} */}
            <ContractViewer
              template={selectedTemplate}
              onStartFromTemplate={handleStartFromTemplate}
              className="h-full bg-white"
            />
          </div>
        </div>

        <NewContractModal
          isOpen={isNewContractModalOpen}
          onClose={() => setIsNewContractModalOpen(false)}
          template={selectedTemplate}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t px-6 py-4 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>© 2024 SmartSignGPT. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <button className="hover:text-black transition-colors duration-200">
              Terms
            </button>
            <button className="hover:text-black transition-colors duration-200">
              Privacy
            </button>
            <button className="hover:text-black transition-colors duration-200">
              Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
