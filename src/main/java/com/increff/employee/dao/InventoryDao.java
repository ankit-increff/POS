package com.increff.employee.dao;

import com.increff.employee.pojo.InventoryPojo;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Repository
public class InventoryDao extends AbstractDao {

	private static String select_id = "select p from InventoryPojo p where id=:id";
	private static String select_all = "select p from InventoryPojo p";

	@PersistenceContext
	private EntityManager em;

	@Transactional
	public InventoryPojo insert(InventoryPojo p) {
		em.persist(p);
		return p;
	}

	public InventoryPojo select(int id) {
		TypedQuery<InventoryPojo> query = getQuery(select_id, InventoryPojo.class);
		query.setParameter("id", id);
		return getSingle(query);
	}

	public List<InventoryPojo> selectAll() {
		TypedQuery<InventoryPojo> query = getQuery(select_all, InventoryPojo.class);
		return query.getResultList();
	}

	public void update(InventoryPojo p) {
	}



}
