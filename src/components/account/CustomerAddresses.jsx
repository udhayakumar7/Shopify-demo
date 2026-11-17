import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Building,
  Phone,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
} from "../../services/shopify/customerApi";
import Button from "../common/Button";
import { Skeleton } from "../common/Skeleton";

export default function CustomerAddresses({
  addresses = [],
  defaultAddress = null,
  loading = false,
  error = null,
  onAddressMutated,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    zoneCode: "",
    zip: "",
    phoneNumber: "",
    countryCode: "IN",
    setAsDefault: false,
  });

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormData({
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      zoneCode: "",
      zip: "",
      phoneNumber: "",
      countryCode: "IN",
      setAsDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setFormData({
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      company: addr.company || "",
      address1: addr.address1 || "",
      address2: addr.address2 || "",
      city: addr.city || "",
      zoneCode: addr.zoneCode || "",
      zip: addr.zip || "",
      phoneNumber: addr.phoneNumber || "",
      countryCode: addr.countryCode || "IN",
      setAsDefault: defaultAddress?.id === addr.id,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address1.trim() || !formData.city.trim() || !formData.zip.trim()) {
      toast.error("Please fill in Street Address, City, and PIN / Postal Code.");
      return;
    }

    try {
      setSubmitting(true);

      const addressPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.company.trim(),
        address1: formData.address1.trim(),
        address2: formData.address2.trim(),
        city: formData.city.trim(),
        zoneCode: formData.zoneCode.trim(),
        zip: formData.zip.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        countryCode: formData.countryCode || "IN",
      };

      if (editingAddress) {
        await updateCustomerAddress(
          editingAddress.id,
          addressPayload,
          formData.setAsDefault
        );
        toast.success("Address updated successfully!");
      } else {
        await createCustomerAddress(addressPayload, formData.setAsDefault);
        toast.success("New delivery address saved!");
      }

      handleCloseModal();
      if (onAddressMutated) onAddressMutated();
    } catch (err) {
      console.error("[CustomerAddresses Save Error]:", err);
      toast.error(err.message || "Unable to save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this delivery address?")) {
      return;
    }

    try {
      setDeletingId(addressId);
      await deleteCustomerAddress(addressId);
      toast.success("Address deleted.");
      if (onAddressMutated) onAddressMutated();
    } catch (err) {
      console.error("[CustomerAddresses Delete Error]:", err);
      toast.error(err.message || "Failed to remove address.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      setDeletingId(addr.id);
      await setDefaultCustomerAddress(addr.id, addr);
      toast.success("Default address updated!");
      if (onAddressMutated) onAddressMutated();
    } catch (err) {
      console.error("[CustomerAddresses Set Default Error]:", err);
      toast.error(err.message || "Unable to set default address.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EADBCE] p-6 sm:p-8 shadow-sm mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EADBCE]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#F4DCD6] text-[#7B1E3A]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#380C19]">
                Saved Delivery Addresses
              </h2>
              {!loading && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFF8F3] border border-[#EADBCE] text-[11px] font-semibold text-[#7B1E3A]">
                  {addresses.length}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8A7B78] mt-0.5">
              Manage your residential and wedding venue shipping destinations.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleOpenAdd}
          icon={Plus}
          className="shadow-sm self-start sm:self-auto"
        >
          Add New Address
        </Button>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-[#EADBCE] space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-44" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 text-center text-xs text-[#7B1E3A] bg-[#F4DCD6] rounded-xl my-6">
          <p className="font-medium">Failed to load saved addresses.</p>
          <p className="mt-1 text-[#8A7B78]">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && addresses.length === 0 && (
        <div className="py-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FFF8F3] border border-[#EADBCE] text-[#C5A059] flex items-center justify-center mx-auto">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-[#380C19]">
              No Saved Addresses
            </h3>
            <p className="text-xs text-[#8A7B78] mt-1 leading-relaxed">
              Save your home or bridal destination address to enjoy seamless, one-click checkout across all future saree orders.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleOpenAdd}
              icon={Plus}
              className="border-[#7B1E3A]"
            >
              Add Your First Address
            </Button>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      {!loading && !error && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
          {addresses.map((addr) => {
            const isDefault = defaultAddress?.id === addr.id;
            const isBusy = deletingId === addr.id;

            return (
              <div
                key={addr.id}
                className={`p-5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isDefault
                    ? "border-[#C5A059] bg-[#FFF8F3]/60 shadow-xs"
                    : "border-[#EADBCE] bg-white hover:border-[#C5A059]/50"
                }`}
              >
                <div>
                  {/* Top line with Default tag */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm text-[#380C19]">
                      {[addr.firstName, addr.lastName].filter(Boolean).join(" ") ||
                        "Recipient"}
                    </h4>
                    {isDefault && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059] text-[#240711] text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                        Default Address
                      </span>
                    )}
                  </div>

                  {/* Company if available */}
                  {addr.company && (
                    <p className="text-xs text-[#8A7B78] flex items-center gap-1.5 mb-1">
                      <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{addr.company}</span>
                    </p>
                  )}

                  {/* Address lines */}
                  <p className="text-xs text-[#380C19]/80 leading-relaxed">
                    {addr.address1}
                    {addr.address2 && <>, {addr.address2}</>}
                  </p>
                  <p className="text-xs text-[#380C19]/80 leading-relaxed mt-0.5">
                    {addr.city}
                    {addr.zoneCode && <>, {addr.zoneCode}</>} - {addr.zip}
                  </p>
                  <p className="text-xs text-[#8A7B78] mt-0.5">
                    {addr.countryCode || "India"}
                  </p>

                  {/* Phone */}
                  {addr.phoneNumber && (
                    <p className="text-xs text-[#8A7B78] flex items-center gap-1.5 mt-2">
                      <Phone className="w-3 h-3 text-[#7B1E3A]" />
                      <span>{addr.phoneNumber}</span>
                    </p>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#EADBCE]/60 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(addr)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1 text-[#7B1E3A] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <span className="text-[#EADBCE]">•</span>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1 text-red-600 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {!isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1 text-[#A4813E] hover:underline font-medium cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Set as Default</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#380C19]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EADBCE] max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE] mb-5">
              <h3 className="font-serif text-xl font-medium text-[#380C19]">
                {editingAddress ? "Edit Delivery Address" : "Add New Delivery Address"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 text-[#8A7B78] hover:text-[#7B1E3A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Recipient's first name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Last name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                />
              </div>

              {/* Company / Landmark */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                  Company / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g. Near Meenakshi Amman Temple"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                  Street Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address1}
                  onChange={(e) =>
                    setFormData({ ...formData, address1: e.target.value })
                  }
                  placeholder="House number, apartment name, street"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={formData.address2}
                  onChange={(e) =>
                    setFormData({ ...formData, address2: e.target.value })
                  }
                  placeholder="Suite, floor, sector, landmark"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                />
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Madurai / Chennai"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={formData.zoneCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zoneCode: e.target.value })
                    }
                    placeholder="Tamil Nadu"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8A7B78] mb-1">
                    PIN / ZIP *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                    placeholder="625020"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] text-sm text-[#380C19] focus:outline-none focus:border-[#7B1E3A]"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.setAsDefault}
                    onChange={(e) =>
                      setFormData({ ...formData, setAsDefault: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-[#EADBCE] text-[#7B1E3A] focus:ring-[#7B1E3A]"
                  />
                  <span className="text-xs text-[#380C19]">
                    Set as default delivery address for all saree orders
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EADBCE]">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={submitting}
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
