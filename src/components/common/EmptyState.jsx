import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText = "Continue Shopping",
  actionLink = "/products",
  onAction,
}) {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto">
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F4DCD6] flex items-center justify-center text-[#7B1E3A]">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-serif font-medium text-[#380C19] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#8A7B78] mb-6 leading-relaxed">
        {description}
      </p>
      {onAction ? (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      ) : (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
    </div>
  );
}
